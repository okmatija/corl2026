# CoRL 2026 · USA trip planner

Planning Matija & Maryna's trip around [CoRL 2026](https://www.corl.org/) (Austin, TX, Nov 9-12 2026).

**Site:** https://okmatija.github.io/corl2026/ - add it to your home screen (iOS: Share → Add to Home Screen; Android: ⋮ → Add to Home screen).

- **Plan** - the current plan: map, stops, where to stay, day by day.
- **Ideas** - idea cards; 👍/👎 with an optional reason; filter by who liked/disliked what.
- **Matija / Maryna** - everything that person has said, plus a box for free-form feedback.

Feedback is sent through a small Cloudflare Worker (`worker/`) that files it as a GitHub issue. Claude reads the open issues,
updates the plan, and closes each issue with a note on what changed - which then shows as ✅ on the site.
