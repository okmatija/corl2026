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
- `scripts/resolve.sh` - close a feedback issue with a resolution.

## Feedback = GitHub issues
Every submission is an issue labelled `feedback` + `from:matija|from:maryna` + `idea|general`.
The body ends with `<!-- feedback-data {...json...} -->` (who, kind, idea id, vote up/down). The quoted lines are the reason/text.
The site shows an issue as "done" once closed, plus the text after `**Resolution:**` in the body.

## "Process feedback" workflow (when the user asks)
1. `gh issue list -R okmatija/corl2026 -l feedback -s open --json number,title,body,labels --limit 200`
2. Decide what each item changes. A later vote by the same person on the same idea supersedes an earlier one.
   Idea votes: 👍 → consider adding to the plan; 👎 → remove/avoid. General notes: budget, dates, must-sees, new ideas (add idea cards).
3. Edit `data/trip.js` (plan, ideas, openQuestions, bump `meta.updated`, refresh `meta.status`).
4. Commit and push (Pages redeploys in ~1 min).
5. For each issue: `scripts/resolve.sh <n> "<one line: what changed>"` - use `not_planned` as 3rd arg if deliberately not acted on, and say why.
   Superseded votes: resolve with "Superseded by #m".
6. Report back a short summary of changes.

## Conventions
- Plan legs: `arrive`/`leave` are check-in/check-out; `days[k]` lists items for day k; idea ids inside strings are expanded to titles.
- Stay prices are estimates - label them so; never present them as quotes.
- Edit files with UTF-8 tools (not PowerShell 5.1 Get-Content/Set-Content, which mangles emoji).
