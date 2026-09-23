// Feedback that has been received and merged into the repo (shown to everyone).
// Shape: { who, target, reaction: "love"|"like"|"meh"|"no"|null, note, date }
// target: "variant:<id>" | "activity:<id>" | "stay:<id>" | "place:<id>" | "general"
window.FEEDBACK = [];

// Latest planning preferences received from each person (see Feedback tab).
window.PREFS = {};
