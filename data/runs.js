// Log of plan updates made from feedback (newest first). Appended by Claude on every run that changes something.
// { start, end: ISO UTC, by: "scheduled" | "manual", model, issues: [numbers], summary, tokens?: number, costUsd?: number }
window.RUNS = [
  { start: "2026-09-24T06:00:00Z", end: "2026-09-24T06:25:00Z", by: "manual", model: "claude-opus-5-5", issues: [13, 14], summary: "Thanksgiving dinner with Maja & Amit in the plan; typo-tolerant search on the Ideas page; rock venues + Veselka; concert availability question." },
  { start: "2026-09-23T22:20:00Z", end: "2026-09-23T22:40:00Z", by: "manual", model: "claude-opus-5-5", issues: [11, 12], summary: "Vegas ideas (Metallica + Wizard of Oz at Sphere), alligator spots, theme parks, NASCAR options; 3 new open questions; plan buttons no longer look selected." },
  { start: "2026-09-23T22:15:00Z", end: "2026-09-23T22:30:00Z", by: "manual", model: "claude-opus-5-5", issues: [9, 10], summary: "Trip extended to Fri 27 Nov: Florida (Miami, Everglades, Keys) + Thanksgiving in NYC; warm-place ideas; place-type emoji; running notes on the Austin hotel map." },
  { start: "2026-09-23T22:00:00Z", end: "2026-09-23T22:12:00Z", by: "manual", model: "claude-opus-5-5", issues: [7, 8], summary: "New Austin map page (venues, Google office, hotel options); feedback on cards hidden by default with a Show toggle." },
  { start: "2026-09-23T21:58:00Z", end: "2026-09-23T22:02:00Z", by: "manual", model: "claude-opus-5-5", issues: [6], summary: "Corrected #6: Enchanted Rock back on Sat 14 Nov (together); Maryna's weekdays no longer use up the nature outings." },
  { start: "2026-09-23T21:51:36Z", end: "2026-09-23T21:52:59Z", by: "scheduled", model: "claude-sonnet-5", issues: [5, 6], summary: "Added Zilker Botanical Garden idea; dropped Enchanted Rock from Sat 14 Nov (kept wine + Luckenbach)." },
  { start: "2026-09-23T21:27:00Z", end: "2026-09-23T21:40:00Z", by: "manual", model: "claude-opus-5-5", issues: [1, 2, 3, 4], summary: "LBJ Library, nature-day Sunday, more nature ideas, SpaceX launch options." },
];

window.AUTOMATION = {
  schedule: "every hour, 06:00-23:00 UK time",
  routineUrl: "https://claude.ai/code/routines/trig_01RbHgoAddVixEGc4gqgDPgb",
};
