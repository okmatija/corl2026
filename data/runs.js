// Log of plan updates made from feedback (newest first). Appended by Claude on every run that changes something.
// { start, end: ISO UTC, by: "scheduled" | "manual", model, issues: [numbers], summary, tokens?: number, costUsd?: number }
window.RUNS = [
  { start: "2026-09-25T09:20:35Z", end: "2026-09-25T09:23:00Z", by: "scheduled", model: "claude-sonnet-5", issues: [63], summary: "Wine tour clashes with Fredericksburg day - asked you" },
  { start: "2026-09-25T09:00:25Z", end: "2026-09-25T09:00:41Z", by: "manual", model: "claude-opus-5-5", issues: [62], summary: "Test comment - no change" },
  { start: "2026-09-25T08:27:00Z", end: "2026-09-25T09:05:00Z", by: "manual", model: "claude-opus-5-5", issues: [60, 61], summary: "New plan: Vegas → Texas before CoRL" },
  { start: "2026-09-24T19:14:00Z", end: "2026-09-24T19:30:00Z", by: "manual", model: "claude-opus-5-5", issues: [52, 53, 54, 55, 56, 57], summary: "Central Park back; small layout tweaks" },
  { start: "2026-09-24T17:21:02Z", end: "2026-09-24T17:23:00Z", by: "scheduled", model: "claude-sonnet-5", issues: [48, 49, 50, 51], summary: "Central Park out, Brooklyn Bridge walk in" },
  { start: "2026-09-24T14:40:00Z", end: "2026-09-24T15:15:00Z", by: "manual", model: "claude-opus-5-5", issues: [], summary: "One 💬 Comment button everywhere" },
  { start: "2026-09-24T13:37:00Z", end: "2026-09-24T14:30:00Z", by: "manual", model: "claude-opus-5-5", issues: [37, 38, 39, 40, 42, 43, 44, 45], summary: "Cost pies, foldable questions, place filters" },
  { start: "2026-09-24T13:22:13Z", end: "2026-09-24T13:25:02Z", by: "scheduled", model: "claude-sonnet-5", issues: [40, 41, 42, 43], summary: "Map links for car hire pick-up/drop-off" },
  { start: "2026-09-24T12:21:41Z", end: "2026-09-24T12:22:38Z", by: "scheduled", model: "claude-sonnet-5", issues: [37, 38, 39], summary: "3 website requests left for Matija" },
  { start: "2026-09-24T12:00:00Z", end: "2026-09-24T12:10:00Z", by: "manual", model: "claude-opus-5-5", issues: [36], summary: "Flight details pages; cabin question" },
  { start: "2026-09-24T11:52:00Z", end: "2026-09-24T11:58:00Z", by: "manual", model: "claude-opus-5-5", issues: [34, 35], summary: "9/11 Museum booking link" },
  { start: "2026-09-24T11:43:00Z", end: "2026-09-24T12:05:00Z", by: "manual", model: "claude-opus-5-5", issues: [30, 31, 32, 33], summary: "London both ways; car hire details" },
  { start: "2026-09-24T11:21:01Z", end: "2026-09-24T11:22:34Z", by: "scheduled", model: "claude-sonnet-5", issues: [28, 29], summary: "Macy's parade out; 9/11 Museum in" },
  { start: "2026-09-24T11:12:06Z", end: "2026-09-24T11:12:54Z", by: "scheduled", model: "claude-haiku-4-5-20251001", issues: [26, 27], summary: "2 test replies - no change" },
  { start: "2026-09-24T10:10:00Z", end: "2026-09-24T10:25:00Z", by: "manual", model: "claude-opus-5-5", issues: [], summary: "One Feedback tab with filters" },
  { start: "2026-09-24T09:45:00Z", end: "2026-09-24T10:05:00Z", by: "manual", model: "claude-opus-5-5", issues: [18, 19, 20, 21, 22, 23, 25], summary: "About page, model picker, replies" },
  { start: "2026-09-24T09:11:48Z", end: "2026-09-24T09:13:15Z", by: "scheduled", model: "claude-sonnet-5", issues: [24], summary: "NYC stay near Maja & Amit" },
  { start: "2026-09-24T07:11:45Z", end: "2026-09-24T07:14:55Z", by: "scheduled", model: "claude-sonnet-5", issues: [15, 16, 17], summary: "NASCAR and COTA options researched" },
  { start: "2026-09-24T06:00:00Z", end: "2026-09-24T06:25:00Z", by: "manual", model: "claude-opus-5-5", issues: [13, 14], summary: "Thanksgiving dinner; typo-proof search" },
  { start: "2026-09-23T22:20:00Z", end: "2026-09-23T22:40:00Z", by: "manual", model: "claude-opus-5-5", issues: [11, 12], summary: "Vegas, alligator, theme park ideas" },
  { start: "2026-09-23T22:15:00Z", end: "2026-09-23T22:30:00Z", by: "manual", model: "claude-opus-5-5", issues: [9, 10], summary: "Trip extended: Florida + NYC" },
  { start: "2026-09-23T22:00:00Z", end: "2026-09-23T22:12:00Z", by: "manual", model: "claude-opus-5-5", issues: [7, 8], summary: "Austin map page" },
  { start: "2026-09-23T21:58:00Z", end: "2026-09-23T22:02:00Z", by: "manual", model: "claude-opus-5-5", issues: [6], summary: "Enchanted Rock back on Sat 14 Nov" },
  { start: "2026-09-23T21:51:36Z", end: "2026-09-23T21:52:59Z", by: "scheduled", model: "claude-sonnet-5", issues: [5, 6], summary: "Zilker Botanical Garden added" },
  { start: "2026-09-23T21:27:00Z", end: "2026-09-23T21:40:00Z", by: "manual", model: "claude-opus-5-5", issues: [1, 2, 3, 4], summary: "LBJ Library, nature Sunday, SpaceX" },
];

window.AUTOMATION = {
  schedule: "hourly, 06:00-23:00 UK time",
  routineUrl: "https://claude.ai/code/routines/trig_01RbHgoAddVixEGc4gqgDPgb",
};
