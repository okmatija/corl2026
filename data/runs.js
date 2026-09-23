// Log of plan updates made from feedback (newest first). Appended by Claude on every run that changes something.
// { start, end: ISO UTC, by: "scheduled" | "manual", model, issues: [numbers], summary, tokens?: number, costUsd?: number }
window.RUNS = [
  { start: "2026-09-23T21:27:00Z", end: "2026-09-23T21:40:00Z", by: "manual", model: "claude-opus-5-5", issues: [1, 2, 3, 4], summary: "LBJ Library, nature-day Sunday, more nature ideas, SpaceX launch options." },
];

window.AUTOMATION = {
  schedule: "every hour, 06:00-23:00 UK time",
  routineUrl: "",
};
