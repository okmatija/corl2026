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

const clean = (s, max) => String(s ?? "").replace(/<!--|-->/g, "").trim().slice(0, max);

async function createFeedback(req, env) {
  const b = await req.json().catch(() => fail(400, "bad json"));
  if (!env.TRIP_KEY || b.key !== env.TRIP_KEY) fail(403, "wrong passcode");
  const people = env.PEOPLE.split(",");
  const who = people.find(p => p.toLowerCase() === String(b.who || "").toLowerCase());
  if (!who) fail(400, "unknown person");

  const kind = b.kind === "idea" ? "idea" : "general";
  const text = clean(b.text, 4000);
  const data = { who, kind, date: new Date().toISOString() };
  let title;
  if (kind === "idea") {
    data.idea = clean(b.idea, 80);
    data.ideaTitle = clean(b.ideaTitle, 120);
    data.vote = b.vote === "down" ? "down" : "up";
    if (!data.idea) fail(400, "missing idea");
    title = `[${who}] ${data.vote === "up" ? "👍" : "👎"} ${data.ideaTitle || data.idea}`;
  } else {
    if (!text) fail(400, "empty feedback");
    title = `[${who}] ${text.split("\n")[0].slice(0, 70)}`;
  }

  const body = [
    kind === "idea" ? `**${who}** ${data.vote === "up" ? "likes 👍" : "dislikes 👎"} idea \`${data.idea}\` - ${data.ideaTitle}` : `**${who}** wrote:`,
    "",
    text ? text.split("\n").map(l => "> " + l).join("\n") : "_(no reason given)_",
    "",
    `<!-- feedback-data ${JSON.stringify(data)} -->`,
  ].join("\n");

  const issue = await gh(env, "/issues", {
    method: "POST",
    body: JSON.stringify({ title, body, labels: ["feedback", `from:${who.toLowerCase()}`, kind] }),
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
        who: d.who, kind: d.kind, idea: d.idea, ideaTitle: d.ideaTitle, vote: d.vote,
        text: quoted, date: d.date || i.created_at,
        resolution: res ? res[1].trim() : null,
      });
    }
    if (issues.length < 100) break;
  }
  return out;
}
