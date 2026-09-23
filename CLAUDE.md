# CoRL 2026 trip planner

Static site (no build step) on GitHub Pages: https://okmatija.github.io/corl2026/
Travellers: Matija and Maryna. CoRL 2026: Austin TX, workshops Nov 9, main conference Nov 10-12, JW Marriott.

## Files
- `data/trip.js` - the whole plan: settings, obligations, places, activities, stays, variants. Edit this, not the HTML.
- `data/feedback.js` - merged feedback (`window.FEEDBACK`) and latest per-person preferences (`window.PREFS`).
- `app.js`, `styles.css`, `index.html` - the viewer. Vanilla JS, mobile-first.
- `assets/` - user inputs (itineraries, wishlists). `assets/private/` is git-ignored: read it, never copy sensitive details (booking refs, addresses, IDs) into tracked files.
- `feedback/` - raw feedback exports.

## Workflow
- When new assets arrive: update obligations/dates/variants in `data/trip.js`, bump `meta.updated`, revise `openQuestions`.
- When feedback arrives (text ending in `---data---` + JSON): append entries to `window.FEEDBACK`, set `window.PREFS[who]` from `prefs`,
  optionally save the raw text to `feedback/`, then adjust variants (respect budgetPerNight, maxDriveHoursPerDay, pace, interests).
- `currentVariant` is the recommended plan. Keep 2-4 variants. Legs: `arrive`/`leave` are check-in/check-out dates; `days[k]` lists
  items for night k, where activity ids are auto-expanded to titles.
- Stay prices are estimates - label them as such; never present them as quotes.
- Edit files with UTF-8 tools (not PowerShell 5.1 Get-Content/Set-Content, which mangles emoji).
