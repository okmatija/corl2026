// Relay between the static trip site and GitHub Issues.
// POST /feedback  -> creates an issue (requires TRIP_KEY)
// GET  /feedback  -> lists all feedback issues (open + closed) in a compact shape
// GET  /check?key -> 204 if the passcode is right

const DATA_RE = /<!--\s*feedback-data\s*(\{[\s\S]*?\})\s*-->/;
const RESOLUTION_RE = /\*\*Resolution:\*\*\s*([\s\S]*)$/;

export default {
  async fetch(req, env) {
    const cors = corsHeaders(req, env);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);
    try {
      if (url.pathname === "/feedback" && req.method === "GET") return json(await listFeedback(env), 200, cors);
      if (url.pathname === "/feedback" && req.method === "POST") return json(await createFeedback(req, env), 201, cors);
      if (url.pathname === "/check") return new Response(null, { status: url.searchParams.get("key") === env.TRIP_KEY ? 204 : 403, headers: cors });
      return json({ error: "not found" }, 404, cors);
    } catch (e) {
      return json({ error: e.message }, e.status || 500, cors);
    }
  },
};

function corsHeaders(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map(s => s.trim());
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

function fail(status, message) { const e = new Error(message); e.status = status; throw e; }

async function gh(env, path, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${env.REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "corl2026-feedback-worker",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) fail(502, `GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const ICON = { up: "👍", down: "👎", add: "📌", remove: "❌", note: "💬" };
const clean = (s, max) => String(s ?? "").replace(/<!--|-->/g, "").trim().slice(0, max);

async function createFeedback(req, env) {
  const b = await req.json().catch(() => fail(400, "bad json"));
  if (!env.TRIP_KEY || b.key !== env.TRIP_KEY) fail(403, "wrong passcode");
  const people = env.PEOPLE.split(",");
  const who = people.find(p => p.toLowerCase() === String(b.who || "").toLowerCase());
  if (!who) fail(400, "unknown person");

  const kind = ["idea", "plan", "reply"].includes(b.kind) ? b.kind : "general";
  const text = clean(b.text, 4000);
  // Which Claude model should action this (each model has its own hourly routine). Sonnet by default.
  const model = ["haiku", "sonnet", "opus"].includes(b.model) ? b.model : "sonnet";
  const data = { who, kind, model, date: new Date().toISOString() };
  let title;
  if (kind === "idea") {
    data.idea = clean(b.idea, 80);
    data.ideaTitle = clean(b.ideaTitle, 120);
    data.vote = ["down", "add", "remove", "note"].includes(b.vote) ? b.vote : "up";   // add/remove = put in / take out of the plan; note = comment
    if (!data.idea) fail(400, "missing idea");
    if (data.vote === "note" && !text) fail(400, "empty comment");
    title = `[${who}] ${ICON[data.vote]} ${{ add: "Add to plan: ", remove: "Remove from plan: " }[data.vote] || ""}${data.ideaTitle || data.idea}`;
  } else if (kind === "plan") {
    data.target = clean(b.target, 80);        // "stop:<place>", "day:<YYYY-MM-DD>", "travel:<place>|home" or "trip:summary"
    data.targetTitle = clean(b.targetTitle, 120);
    data.vote = ["down", "note"].includes(b.vote) ? b.vote : "up";   // note = 💬 comment, no sentiment
    if (!/^(stop|day|travel|trip):[\w-]+$/.test(data.target)) fail(400, "bad plan target");
    if (data.vote === "note" && !text) fail(400, "empty comment");
    title = `[${who}] ${ICON[data.vote]} Plan: ${data.targetTitle || data.target}`;
  } else if (kind === "reply") {
    // A comment on someone's earlier feedback item (issue #replyTo)
    data.replyTo = parseInt(b.replyTo, 10);
    data.replyToWho = people.find(p => p.toLowerCase() === String(b.replyToWho || "").toLowerCase()) || "";
    if (!(data.replyTo > 0)) fail(400, "bad replyTo");
    if (["up", "down"].includes(b.vote)) data.vote = b.vote;   // optional sentiment
    if (!text && !data.vote) fail(400, "empty reply");
    title = `[${who}] ${ICON[data.vote || "note"]} Re #${data.replyTo}${data.replyToWho ? ` (${data.replyToWho})` : ""}: ${text.split("\n")[0].slice(0, 60)}`;
  } else {
    if (["up", "down"].includes(b.vote)) data.vote = b.vote;   // optional sentiment
    if (!text) fail(400, "empty feedback");
    title = `[${who}] ${text.split("\n")[0].slice(0, 70)}`;
  }

  const body = [
    kind === "idea" ? `**${who}** ${{ up: "likes 👍", down: "dislikes 👎", add: "wants to add 📌 to the plan:", remove: "wants to remove ❌ from the plan:", note: "comments 💬 on" }[data.vote]} idea \`${data.idea}\` - ${data.ideaTitle}`
      : kind === "plan" ? `**${who}** ${{ up: "likes 👍", down: "dislikes 👎", note: "comments 💬 on" }[data.vote]} this part of the plan: \`${data.target}\` - ${data.targetTitle}`
      : kind === "reply" ? `**${who}** ${data.vote ? ICON[data.vote] + " " : ""}commented on #${data.replyTo}${data.replyToWho ? ` (${data.replyToWho}'s feedback)` : ""}:`
      : `**${who}**${data.vote ? " " + ICON[data.vote] : ""} wrote:`,
    "",
    text ? text.split("\n").map(l => "> " + l).join("\n") : "_(no reason given)_",
    "",
    `<!-- feedback-data ${JSON.stringify(data)} -->`,
  ].join("\n");

  const issue = await gh(env, "/issues", {
    method: "POST",
    body: JSON.stringify({ title, body, labels: ["feedback", `from:${who.toLowerCase()}`, kind, `model:${model}`] }),
  });
  return { number: issue.number, url: issue.html_url };
}

async function listFeedback(env) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const issues = await gh(env, `/issues?labels=feedback&state=all&per_page=100&page=${page}&sort=created&direction=desc`);
    for (const i of issues) {
      const m = DATA_RE.exec(i.body || "");
      if (!m) continue;
      let d; try { d = JSON.parse(m[1]); } catch { continue; }
      const quoted = (i.body.split(DATA_RE)[0].match(/^> ?.*$/gm) || []).map(l => l.replace(/^> ?/, "")).join("\n");
      const res = RESOLUTION_RE.exec(i.body.split(DATA_RE).slice(2).join("") || "");
      out.push({
        number: i.number, url: i.html_url, state: i.state,
        who: d.who, kind: d.kind, idea: d.idea, ideaTitle: d.ideaTitle, target: d.target, targetTitle: d.targetTitle, vote: d.vote,
        replyTo: d.replyTo, replyToWho: d.replyToWho, model: d.model,
        text: quoted, date: d.date || i.created_at, closedAt: i.closed_at,
        resolution: res ? res[1].trim() : null,
      });
    }
    if (issues.length < 100) break;
  }
  return out;
}
