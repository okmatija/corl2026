# CoRL 2026 trip planner

Static site (no build step) on GitHub Pages: https://okmatija.github.io/corl2026/
Travellers: Matija and Maryna. CoRL 2026: Austin TX, workshops Nov 9, main conference Nov 10-12, JW Marriott.

## Files
- `data/trip.js` - everything shown: meta, obligations, openQuestions, places, ideas (idea cards), plan (the ONE plan). Edit this, not the HTML.
- `data/config.js` - `FEEDBACK_API` = URL of the Cloudflare Worker.
- `app.js`, `styles.css`, `index.html` - the viewer. Vanilla JS, mobile-first. Tabs: Plan, Ideas, Matija, Maryna.
- `worker/` - Cloudflare Worker that turns site submissions into GitHub issues and lists them back. Secrets: GITHUB_TOKEN, TRIP_KEY.
- `assets/` - user inputs. `assets/private/` is git-ignored: read it, never copy sensitive details (booking refs, addresses, IDs) into tracked files.
- `assets/private/notes.md` - private facts extracted from work documents (policy, schedule). Read it first when planning.
- `scripts/resolve.sh` - close a feedback issue with a resolution (needs `gh`; in cloud runs use the GitHub MCP tools to do the same: append `---
**Resolution:** ...` to the body, comment, close).
- `data/runs.js` - update history shown on the #updates page. A scheduled cloud routine processes feedback hourly 06:00-23:00 UK.
  If there are no open feedback issues, do nothing (no commit).

## Feedback = GitHub issues
Every submission is an issue labelled `feedback` + `from:matija|from:maryna` + `idea|plan|general`.
The body ends with `<!-- feedback-data {...json...} -->` (who, kind, vote up/down, and either `idea` id or plan `target`).
`plan` targets are `stop:<place id>` (a whole stop/leg) or `day:<YYYY-MM-DD>` (one day of the plan). The quoted lines are the reason/text.
The site shows an issue as "done" once closed, plus the text after `**Resolution:**` in the body.

## "Process feedback" workflow (when the user asks)
1. `gh issue list -R okmatija/corl2026 -l feedback -s open --json number,title,body,labels --limit 200`
2. Decide what each item changes. Read the reason carefully - a 👎 with a reason means "apply the reason", not "delete the item".
   Check your change actually moves the plan towards what they asked (e.g. "save nature for when we're both free" means move
   nature to shared days, not remove it). If the intent is genuinely ambiguous, make no plan change: add an open question
   quoting them and resolve the issue saying you asked. A later vote by the same person on the same idea supersedes an earlier one.
   Answers to open questions arrive as general notes formatted `Q: <question>` / `A: <answer>`. Use the answer to update the plan,
   then remove (or reword) that entry in `openQuestions` once it's settled.
   Idea votes: 👍 → consider adding to the plan; 👎 → remove/avoid. Plan votes: 👍 → keep as is; 👎 → rework that stop/day using the reason. Plan `vote: "note"` = 💬 comment on a stop (question/idea, no sentiment). General notes: budget, dates, must-sees, new ideas (add idea cards).
3. Edit `data/trip.js` (plan, ideas, openQuestions, bump `meta.updated`, refresh `meta.status`).
4. Prepend an entry to `window.RUNS` in `data/runs.js`: start/end ISO UTC times (`date -u +%Y-%m-%dT%H:%M:%SZ` at start and just
   before committing), `by` ("scheduled" or "manual"), model id, issue numbers, a one-line summary. Add `tokens`/`costUsd` only if known.
   Then commit and push to `main` (Pages redeploys in ~1 min).
5. For each issue: `scripts/resolve.sh <n> "<one line: what changed>"` - use `not_planned` as 3rd arg if deliberately not acted on, and say why.
   Superseded votes: resolve with "Superseded by #m".
6. Report back a short summary of changes.

## Conventions
- Plan legs: `arrive`/`leave` are check-in/check-out; `days[k]` lists items for day k; idea ids inside strings are expanded to titles.
- Stay prices are estimates - label them so; never present them as quotes.
- Edit files with UTF-8 tools (not PowerShell 5.1 Get-Content/Set-Content, which mangles emoji).
