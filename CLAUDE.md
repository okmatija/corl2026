# CoRL 2026 trip planner

Static site (no build step) on GitHub Pages: https://okmatija.github.io/corl2026/
Travellers: Matija and Maryna. CoRL 2026: Austin TX, workshops Nov 9, main conference Nov 10-12, JW Marriott.

## Files
- `data/trip.js` - everything shown: meta, obligations, openQuestions, places, ideas (idea cards), plan (the ONE plan). Edit this, not the HTML.
- `data/config.js` - `FEEDBACK_API` = URL of the Cloudflare Worker.
- `app.js`, `styles.css`, `index.html` - the viewer. Vanilla JS, mobile-first. Tabs: Plan, Ideas, Comments (#comments; composer + filterable history, cards tinted blue=Matija / pink=Maryna), ℹ️ Help (#about: guide + update history).
- `worker/` - Cloudflare Worker that turns site submissions into GitHub issues and lists them back. Secrets: GITHUB_TOKEN, TRIP_KEY.
- `assets/` - user inputs. `assets/private/` is git-ignored: read it, never copy sensitive details (booking refs, addresses, IDs) into tracked files.
- `assets/private/notes.md` - private facts extracted from work documents (policy, schedule). Read it first when planning.
- `scripts/resolve.sh` - close a feedback issue with a resolution (needs `gh`; in cloud runs use the GitHub MCP tools to do the same: append `---
**Resolution:** ...` to the body, comment, close).
- `data/runs.js` - update history shown on the #updates page. A scheduled cloud routine processes feedback hourly 06:00-23:00 UK.
  If there are no open feedback issues, do nothing (no commit).

## Comments (a.k.a. feedback) = GitHub issues
The site calls them "comments"; internally they are still `feedback` (label, kinds, Worker, this file).
Every submission is an issue labelled `feedback` + `from:matija|from:maryna` + `idea|plan|reply|general` + `model:haiku|sonnet|opus`.
`model:*` = which Claude model the sender picked to action it. There is one hourly routine per model (Sonnet, the default, also takes
issues with no model label); interactive sessions handle any model. `reply` = a comment on another feedback item
(`replyTo` issue number, `replyToWho`): read the original issue for context; act on it if it changes the plan, otherwise
resolve it as noted.
The body ends with `<!-- feedback-data {...json...} -->` (who, kind, vote up/down, and either `idea` id or plan `target`).
`plan` targets are `stop:<place id>` (a whole stop/leg), `day:<YYYY-MM-DD>` (one day of the plan) or
`travel:<place id>` (the journey INTO that stop, i.e. its leg's `travel` text) / `travel:home` (the flight home, `plan.end`). The quoted lines are the reason/text.
The site shows an issue as "done" once closed, plus the text after `**Resolution:**` in the body.

## "Process feedback" workflow (when the user asks)
0. Interactive sessions: first add the label `in-progress` to every open issue you're about to handle
   (`gh issue edit N --add-label in-progress`) so the hourly agent skips them; remove it if you stop without resolving.
   Scheduled runs: skip issues labelled `in-progress` or `site`, and `git fetch` right before pushing - if the issues
   you handled were closed meanwhile, discard your changes.
1. `gh issue list -R okmatija/corl2026 -l feedback -s open --json number,title,body,labels --limit 200`
   Requests to change the WEBSITE itself (layout, new pages/features, how feedback is shown) are not plan changes:
   scheduled runs must NOT close them - add the label `site`, leave them open, and move on. They are handled in an
   interactive session with Matija (which implements them, then closes them normally).
2. Decide what each item changes. Read the reason carefully - a 👎 with a reason means "apply the reason", not "delete the item".
   Check your change actually moves the plan towards what they asked (e.g. "save nature for when we're both free" means move
   nature to shared days, not remove it). If the intent is genuinely ambiguous, make no plan change: add an open question
   quoting them and resolve the issue saying you asked.
   Same when feedback CONFLICTS (Matija vs Maryna, or with an earlier decision/work dates) or raises a question you need
   answered: add a new entry to `openQuestions` that states the options, so they can 💬 Answer it on the Plan page. A later vote by the same person on the same idea supersedes an earlier one.
   Answers to open questions arrive as general notes formatted `Q: <question>` / `A: <answer>`. Use the answer to update the plan,
   then remove (or reword) that entry in `openQuestions` once it's settled.
   Votes (`vote`): `add` (📌 "Add to plan" on an idea) → fit it into the plan. `note` = a 💬 comment with no sentiment - act on
   the text. `up`/`down` = an optional 👍/👎 the person attached to a comment (on ideas, plan stops/days/journeys, replies and
   general notes): 👍 = keep/more of this, 👎 = rework/avoid it, using the text as the reason.
   Idea votes: 👍 → consider adding to the plan; 👎 → remove/avoid. Plan votes: 👍 → keep as is; 👎 → rework that stop/day using the reason. Plan `vote: "note"` = 💬 comment on a stop (question/idea, no sentiment). General notes: budget, dates, must-sees, new ideas (add idea cards).
3. Edit `data/trip.js` (plan, ideas, openQuestions; set `meta.updated` to the current UTC time as `date -u +%Y-%m-%dT%H:%MZ` -
   the Trip Summary shows it). Validate BOTH data files load before committing:
   `node -e "global.window={}; require('./data/trip.js'); require('./data/runs.js'); console.log(window.RUNS.length)"`
   (an hourly run once deleted the `window.RUNS = [` line, which silently broke the About/usage page).
4. Prepend an entry to `window.RUNS` in `data/runs.js`: start/end ISO UTC times (`date -u +%Y-%m-%dT%H:%M:%SZ` at start and just
   before committing), `by` ("scheduled" or "manual"), model id, issue numbers, a one-line summary. Add `tokens`/`costUsd` only if known.
   Then commit and push to `main` (Pages redeploys in ~1 min).
5. For each issue: `scripts/resolve.sh <n> "<one line: what changed>"` - use `not_planned` as 3rd arg if deliberately not acted on, and say why.
   Superseded votes: resolve with "Superseded by #m".
6. Report back a short summary of changes.

## Conventions
- 📄 Details pages are a standard idiom: add an entry to `TRIP.details` keyed like a plan target (`stop:<place>`,
  `travel:<place>`, `travel:home`) with `{ title, intro, sections: [{ title, items: [{ name, text, link }] }] }` (or `{ href }`
  to an existing page). The card then shows a "📄 Details" button. When feedback asks for "more details" on something, do this.
- Ideas can have `link` (official website / booking page): shown on the idea card and makes the idea's name a link in the plan.
  Add one whenever feedback asks for a booking/website link.
- `plan.costs` = estimated flights / car hire (type flights|car, amount USD for both, date or from/to). The Trip Summary pies
  add hotels (from each leg's stay) and "things to do" (from the $ rating of ideas in the plan). Update costs when prices are
  looked up or things get booked.
- `plan.home` ("London") is where the trip starts and ends.
- Plan legs: `arrive`/`leave` are check-in/check-out; `days[k]` lists items for day k (the LAST leg has one extra entry for
  its departure day, shown in that stop's card); idea ids inside strings are expanded to titles.
- Stay prices are estimates - label them so; never present them as quotes.
- Edit files with UTF-8 tools (not PowerShell 5.1 Get-Content/Set-Content, which mangles emoji).
