(() => {
  "use strict";

  const T = window.TRIP;
  const API = (window.FEEDBACK_API || "").replace(/\/$/, "");
  const PEOPLE = T.meta.travellers;
  const CATS = { nature: "🌲 Nature", food: "🍽️ Food", culture: "🏛️ Culture", music: "🎸 Music", city: "🏙️ City", night: "🌙 Night", adventure: "🧗 Adventure" };

  const ideas = Object.fromEntries(T.ideas.map(a => [a.id, a]));
  const idPattern = new RegExp("\\b(" + T.ideas.map(a => a.id).sort((a, b) => b.length - a.length).join("|") + ")\\b", "g");
  const inPlan = new Set();
  T.plan.legs.forEach(l => (l.days || []).flat().forEach(s => (s.match(idPattern) || []).forEach(id => inPlan.add(id))));

  // ---------- storage (never throws) ----------
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem("corl2." + k); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem("corl2." + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  let who = store.get("who", null);
  let feedback = store.get("feedback", []);   // last list from the API (shown instantly, then refreshed)
  let loadState = API ? "loading" : "off";
  const ui = store.get("ui", { filter: "all", region: "all" });
  let map = null;

  // ---------- helpers ----------
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const d = s => new Date(s.length === 10 ? s + "T12:00:00" : s);
  const iso = dt => dt.toISOString().slice(0, 10);
  const addDays = (s, n) => { const x = d(s); x.setDate(x.getDate() + n); return iso(x); };
  const nightsBetween = (a, b) => Math.round((d(b) - d(a)) / 86400000);
  const fmt = (s, opts = { weekday: "short", day: "numeric", month: "short" }) => d(s).toLocaleDateString("en-GB", opts);
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const place = id => T.places[id] || { name: id };
  const short = id => place(id).name.split(",")[0].split(" (")[0];
  const vIcon = v => ({ up: "👍", down: "👎", note: "💬" })[v] || "👍";

  // Latest vote per person per idea
  // key: an idea id, or a plan target like "stop:austin" / "day:2026-11-08"
  function votes(key) {
    const out = {};
    feedback.filter(f => (f.kind === "idea" && f.idea === key) || (f.kind === "plan" && f.target === key && f.vote !== "note"))
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach(f => { out[f.who] = f; });
    return out;
  }

  // 💬 comments on a plan stop - all of them, oldest first (they don't replace votes)
  const comments = key => feedback.filter(f => f.kind === "plan" && f.target === key && f.vote === "note")
    .sort((a, b) => a.date.localeCompare(b.date));

  // ---------- API ----------
  async function loadFeedback() {
    if (!API) return;
    try {
      const res = await fetch(API + "/feedback", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      feedback = await res.json();
      store.set("feedback", feedback);
      loadState = "ok";
    } catch { loadState = "error"; }
    rerender();
  }

  async function passcode() {
    let key = store.get("key", "");
    if (key) return key;
    key = (await ask({ title: "Trip passcode", body: "Enter the passcode Matija set up (only needed once on this device).", placeholder: "passcode", input: true }))?.trim();
    if (!key) return null;
    const ok = await fetch(API + "/check?key=" + encodeURIComponent(key)).then(r => r.status === 204).catch(() => false);
    if (!ok) { toast("Wrong passcode"); return null; }
    store.set("key", key);
    return key;
  }

  async function submit(payload) {
    if (!API) { toast("Feedback service isn't connected yet"); return false; }
    const key = await passcode();
    if (!key) return false;
    try {
      const res = await fetch(API + "/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, key }) });
      const body = await res.json().catch(() => ({}));
      if (res.status === 403) { store.set("key", ""); toast("Passcode rejected - try again"); return false; }
      if (!res.ok) throw new Error(body.error || res.status);
      feedback.unshift({ ...payload, number: body.number, url: body.url, state: "open", date: new Date().toISOString(), resolution: null });
      store.set("feedback", feedback);
      toast("Sent ✓");
      rerender();
      return true;
    } catch (e) { toast("Couldn't send: " + e.message); return false; }
  }

  // ---------- views ----------
  function viewPlan() {
    const P = T.plan;
    const nights = P.legs.reduce((n, l) => n + nightsBetween(l.arrive, l.leave), 0);
    const lodging = P.legs.reduce((n, l) => n + (l.stay?.price || 0) * nightsBetween(l.arrive, l.leave), 0);
    const legs = P.legs.map((l, i) => {
      const n = nightsBetween(l.arrive, l.leave);
      const p = place(l.place);
      const days = Array.from({ length: n }, (_, k) => {
        const date = addDays(l.arrive, k);
        const obl = T.obligations.filter(o => date >= o.start && date <= o.end).map(o => `<span class="oblig">💼 ${o.who ? esc(o.who) + ": " : ""}${esc(o.title)}</span>`);
        const items = (l.days?.[k] || []).map(s => esc(s).replace(idPattern, id => `<b>${esc(ideas[id].title)}</b>${ideaMarks(id)}`));
        const lines = [...obl, ...items];
        const key = "day:" + date, v = votes(key);
        const dayTitle = `${fmt(date)} in ${short(l.place)}`;
        return `<div class="day"><div class="date"><b>${fmt(date, { weekday: "short" })}</b>${fmt(date, { day: "numeric", month: "short" })}
          <div class="mini">${voteBtn(key, dayTitle, "up", true)}${voteBtn(key, dayTitle, "down", true)}</div></div>
          <div><ul>${lines.map(x => `<li>${x}</li>`).join("") || "<li class='muted'>Free</li>"}</ul>${voteChips(v)}</div></div>`;
      }).join("");
      const s = l.stay;
      return `
        <div class="leg">
          <div class="dot">${i + 1}</div>
          <div class="travel">${esc(l.travel || "")}</div>
          <div class="card">
            <div class="item-head"><h3>${esc(p.name)}</h3><span class="tag">${n} night${n > 1 ? "s" : ""}</span></div>
            <div class="item-meta">${fmt(l.arrive)} → ${fmt(l.leave)} · ${esc(p.blurb || "")}</div>
            ${l.place === "austin" && T.austinMap ? `<p style="margin:8px 0 0"><a href="#austin">🗺️ Map of CoRL venues, Google office & hotel options →</a></p>` : ""}
            ${s ? `<div class="stay"><div class="item-head"><span>🛏️ ${esc(s.name)}</span>${s.covered ? '<span class="tag ok">paid by work</span>' : `<span class="tag ${s.price <= P.budgetPerNight ? "ok" : "over"}">~${money(s.price)}/nt</span>`}</div>${s.notes ? `<div class="item-meta">${esc(s.notes)}</div>` : ""}</div>` : ""}
            <div class="days">${days}</div>
            ${voteChips(votes("stop:" + l.place))}
            ${comments("stop:" + l.place).map(f => `<div class="fb note"><b>${esc(f.who)} 💬</b> ${esc(f.text)}</div>`).join("")}
            <div class="vote">${["up", "down", "note"].map(dir => voteBtn("stop:" + l.place, `Stop: ${p.name}`, dir)).join("")}</div>
          </div>
        </div>`;
    }).join("");
    const end = P.end || { date: P.legs.at(-1).leave, text: "" };

    return `
      <div class="card accent">
        <h2>${esc(P.name)}</h2>
        <p class="muted" style="margin:4px 0">${esc(P.summary)}</p>
        <div class="stats">
          <div class="stat"><b>${fmt(P.legs[0].arrive, { day: "numeric", month: "short" })} – ${fmt(end.date, { day: "numeric", month: "short" })}</b><span>${nights} nights</span></div>
          <div class="stat"><b>${money(lodging)}</b><span>our lodging est. (excl. work-paid nights) · budget ${money(P.budgetPerNight)}/nt</span></div>
        </div>
      </div>
      <div class="banner">${esc(T.meta.status)} Updated ${esc(T.meta.updated)}.</div>
      ${fbToggle()}
      ${autoBanner()}
      ${T.openQuestions?.length ? `<div class="card"><h3>Open questions</h3>${T.openQuestions.map((q, i) => `
        <div class="question">
          <div class="q-row"><span>${esc(q)}</span><button class="q-btn" data-answer="${i}" aria-label="Answer this question">💬 Answer</button></div>
          ${answers(q).map(f => `<div class="fb note"><b>${esc(f.who)} 💬</b> ${esc(f.answer)}</div>`).join("")}
        </div>`).join("")}</div>` : ""}
      <div id="map" role="img" aria-label="Route map"></div>
      ${legs}
      <div class="leg"><div class="dot">✓</div><div class="travel">🏁 ${fmt(end.date)} · ${esc(end.text)}</div></div>
    `;
  }

  // ---------- Austin venues & hotels (#austin) ----------
  const km = (a, b) => {
    const r = x => x * Math.PI / 180, dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  };
  const gmaps = addr => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

  function viewAustin() {
    const A = T.austinMap, jw = A.work[0], bass = A.work[2];
    const dist = h => `${km(h, jw).toFixed(1)} km to JW Marriott · ${km(h, bass).toFixed(1)} km to Bass Hall`;
    return `
      <p style="margin:4px 0"><a href="#plan">← Plan</a></p>
      <h2>Austin: venues & hotels</h2>
      <p class="muted small">💼 = where Matija works · 🛏️ = hotel options (prices are rough estimates for CoRL week). Tap a pin or name for directions.</p>
      <div id="amap" role="img" aria-label="Map of Austin venues and hotels"></div>
      <div class="card"><h3>💼 Work</h3>${A.work.map(w => `<div class="item"><a class="item-title" href="${gmaps(w.address)}" target="_blank" rel="noopener">${esc(w.name)}</a><div class="item-meta">${esc(w.address)}</div></div>`).join("")}</div>
      <div class="card"><h3>🛏️ Hotel options</h3>${A.hotels.slice().sort((a, b) => km(a, jw) - km(b, jw)).map(h => `<div class="item">
        <div class="item-head"><a class="item-title" href="${gmaps(h.name + ", " + h.address)}" target="_blank" rel="noopener">${esc(h.name)}</a><span class="tag">~${money(h.price)}/nt</span></div>
        <div class="item-meta">${esc(dist(h))}${h.note ? " · " + esc(h.note) : ""}</div></div>`).join("")}
        <p class="muted small" style="margin:8px 0 0">Matija's work covers his room for 7-13 Nov, so this mostly matters for where you'd like to be based.</p></div>`;
  }

  function drawAustinMap(el) {
    const A = T.austinMap;
    map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
    const pin = (p, cls, label) => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: "", html: `<div class="apin ${cls}">${label}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] }),
      zIndexOffset: cls === "work" ? 1000 : 0,
    }).addTo(map).bindPopup(`<b>${esc(p.name)}</b><br>${p.price ? `~${money(p.price)}/nt<br>` : ""}<a href="${gmaps(p.name + ", " + p.address)}" target="_blank" rel="noopener">Open in Google Maps</a>`);
    A.hotels.forEach(h => pin(h, "hotel", "🛏️"));
    A.work.forEach(w => pin(w, "work", "💼"));
    map.fitBounds([...A.work, ...A.hotels].map(p => [p.lat, p.lng]), { padding: [24, 24] });
  }

  function drawMap() {
    if (map) { map.remove(); map = null; }
    const amap = document.getElementById("amap");
    if (amap) { if (window.L) drawAustinMap(amap); return; }
    const el = document.getElementById("map");
    if (!el) return;
    if (!window.L) { el.innerHTML = '<p class="muted" style="padding:12px">Map unavailable offline.</p>'; return; }
    const pts = T.plan.legs.map(l => place(l.place)).filter(p => p.lat);
    map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    const latlngs = pts.map(p => [p.lat, p.lng]);
    L.polyline(latlngs, { color: "#c2410c", weight: 3, dashArray: "6 6" }).addTo(map);
    pts.forEach((p, i) => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: "", html: `<div class="pin">${i + 1}</div>`, iconSize: [24, 24], iconAnchor: [12, 12] }),
    }).addTo(map).bindPopup(esc(p.name)));
    map.fitBounds(latlngs, { padding: [30, 30] });
  }

  const FILTERS = [
    ["all", "All"],
    ["plan", "In the plan"],
    ...PEOPLE.flatMap(p => [[`${p}:up`, `${p} 👍`], [`${p}:down`, `${p} 👎`]]),
    ["none", "No feedback yet"],
  ];

  function matches(idea) {
    const f = ui.filter;
    if (f === "all") return true;
    if (f === "plan") return inPlan.has(idea.id);
    const v = votes(idea.id);
    if (f === "none") return !Object.keys(v).length;
    const [p, dir] = f.split(":");
    return v[p]?.vote === dir;
  }

  function ideaCard(a) {
    const v = votes(a.id);
    const mine = who ? v[who]?.vote : null;
    const q = encodeURIComponent(a.title.replace(/\(.*?\)/g, "") + " " + place(a.place).name);
    const reactions = voteChips(v);
    return `<article class="idea">
      <div class="item-head"><h3>${esc(a.title)}</h3>${inPlan.has(a.id) ? '<span class="tag star">in plan</span>' : ""}</div>
      <div class="item-meta">📍 ${esc(short(a.place))} · ${CATS[a.cat] || ""} · ${esc(a.dur)} · ${esc(a.cost)}</div>
      <p>${esc(a.why)} <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">map</a></p>
      ${reactions}
      <div class="vote">
        <button data-vote="up" data-idea="${a.id}" class="${mine === "up" ? "on" : ""}">👍 Like</button>
        <button data-vote="down" data-idea="${a.id}" class="${mine === "down" ? "on" : ""}">👎 Dislike</button>
      </div>
    </article>`;
  }

  // Compact "Matija 👍" marks shown after an idea's title inside the plan
  function ideaMarks(id) {
    const v = votes(id);
    return PEOPLE.filter(p => v[p]).map(p => ` <span class="pv ${v[p].vote}" title="${esc(v[p].text || "")}">${esc(p)} ${vIcon(v[p].vote)}</span>`).join("");
  }

  const isAnswer = f => f.kind === "general" && /^Q: [\s\S]*\nA: /.test(f.text || "");

  // Answers are general notes whose text starts with "Q: <question>" then "A: <answer>"; latest per person wins.
  function answers(q) {
    const out = {};
    const prefix = "Q: " + q + "\nA: ";
    feedback.filter(f => f.kind === "general" && f.text?.startsWith(prefix))
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach(f => { out[f.who] = { ...f, answer: f.text.slice(prefix.length) }; });
    return Object.values(out);
  }

  function fbToggle() {
    const n = feedback.filter(f => f.kind !== "general" || isAnswer(f)).length;
    return `<div class="row"><button class="chip ${ui.showFb ? "on" : ""}" data-togglefb>💬 ${ui.showFb ? "Hide" : "Show"} everyone's feedback${n ? ` (${n})` : ""}</button></div>`;
  }

  function voteChips(v) {
    return PEOPLE.filter(p => v[p]).map(p => `
      <div class="fb ${v[p].vote}"><b>${esc(p)} ${vIcon(v[p].vote)}</b>${v[p].text ? ` ${esc(v[p].text)}` : ""}</div>`).join("");
  }

  // Like/Dislike button for a plan stop or day. mini = icon-only (day rows).
  function voteBtn(key, title, dir, mini) {
    const on = who && votes(key)[who]?.vote === dir;
    const label = { up: "Like", down: "Dislike", note: "Comment" }[dir];
    return `<button class="${on ? "on" : ""}" data-planvote="${dir}" data-target="${esc(key)}" data-title="${esc(title)}" aria-label="${label} ${esc(title)}">${vIcon(dir)}${mini ? "" : " " + label}</button>`;
  }

  function viewIdeas() {
    const regions = [...new Set(T.ideas.map(a => a.place))];
    const list = T.ideas.filter(a => (ui.region === "all" || a.place === ui.region) && matches(a));
    const groups = regions.map(r => ({ r, items: list.filter(a => a.place === r) })).filter(g => g.items.length);
    return `
      <h2>Ideas</h2>
      ${fbToggle()}
      ${statusBanner()}
      <div class="chips">${FILTERS.map(([k, l]) => `<button class="chip ${ui.filter === k ? "on" : ""}" data-filter="${esc(k)}">${esc(l)}</button>`).join("")}</div>
      <select id="region" aria-label="Region"><option value="all">All places</option>${regions.map(r => `<option value="${r}" ${ui.region === r ? "selected" : ""}>${esc(place(r).name)}</option>`).join("")}</select>
      <p class="muted small">${list.length} idea${list.length === 1 ? "" : "s"}</p>
      ${groups.map(g => `<h3 class="region">${esc(place(g.r).name)}</h3>${g.items.map(ideaCard).join("")}`).join("") || '<p class="muted">Nothing matches this filter.</p>'}
    `;
  }

  function viewPerson(name) {
    const mine = feedback.filter(f => f.who === name).sort((a, b) => b.date.localeCompare(a.date));
    const open = mine.filter(f => f.state === "open").length;
    return `
      <h2>${esc(name)}'s feedback</h2>
      ${statusBanner()}
      <div class="card accent">
        <h3>Add feedback</h3>
        <p class="muted small" style="margin:0 0 8px">Anything: must-sees, budget per night, where to stay, dates, dealbreakers, answers to the open questions…</p>
        <textarea id="freeText" rows="4" placeholder="e.g. Budget ~150/night. I'd love a day at the beach."></textarea>
        <div class="row end" style="margin-top:8px"><button class="primary" data-send="${esc(name)}">💬 Send as ${esc(name)}</button></div>
      </div>
      <p class="muted small">${mine.length} item${mine.length === 1 ? "" : "s"} · ${open} waiting for Claude · ${mine.length - open} done</p>
      ${mine.map(f => `
        <div class="card fbitem ${f.state}">
          <div class="item-head">
            <span>${f.kind === "idea" ? `${vIcon(f.vote)} <b>${esc(f.ideaTitle || ideas[f.idea]?.title || f.idea)}</b>`
              : f.kind === "plan" ? `${vIcon(f.vote)} <b>Plan · ${esc(f.targetTitle || f.target)}</b>`
              : isAnswer(f) ? `💬 <b>Answer · ${esc(f.text.slice(3).split("\nA: ")[0])}</b>` : "💬 <b>General</b>"}</span>
            <span class="tag ${f.state === "open" ? "over" : "ok"}">${f.state === "open" ? "⏳ open" : "✅ done"}</span>
          </div>
          ${f.text ? `<p>${esc(isAnswer(f) ? f.text.split("\nA: ").slice(1).join("\nA: ") : f.text).replace(/\n/g, "<br>")}</p>` : ""}
          ${f.resolution ? `<p class="resolution">🤖 ${esc(f.resolution)}</p>` : ""}
          <div class="item-meta">${fmt(f.date.slice(0, 10))}${f.url ? ` · <a href="${esc(f.url)}" target="_blank" rel="noopener">#${f.number}</a>` : ""}</div>
        </div>`).join("") || '<p class="muted">No feedback yet.</p>'}
    `;
  }

  function autoBanner() {
    const A = window.AUTOMATION;
    if (!A) return "";
    const last = (window.RUNS || [])[0];
    return `<div class="banner info">🤖 Claude reads new feedback and updates this plan <b>${esc(A.schedule)}</b>.${last ? ` Last update ${fmt(last.end.slice(0, 10))}.` : ""} <a href="#updates">Update history & cost →</a></div>`;
  }

  function viewUpdates() {
    const runs = window.RUNS || [];
    const mins = r => Math.max(1, Math.round((new Date(r.end) - new Date(r.start)) / 60000));
    const totalMin = runs.reduce((n, r) => n + mins(r), 0);
    const tokens = runs.reduce((n, r) => n + (r.tokens || 0), 0);
    const cost = runs.reduce((n, r) => n + (r.costUsd || 0), 0);
    const issues = runs.reduce((n, r) => n + (r.issues?.length || 0), 0);
    const time = r => new Date(r.end).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    return `
      <h2>Plan updates</h2>
      <div class="card">
        <p style="margin:0">A scheduled Claude agent checks for new feedback <b>${esc(window.AUTOMATION?.schedule || "")}</b>. If there's nothing new it stops straight away, and nothing is logged here. When there is feedback it updates the plan, closes the GitHub issues with a note, and adds a row below.</p>
        <div class="stats">
          <div class="stat"><b>${runs.length}</b><span>updates</span></div>
          <div class="stat"><b>${issues}</b><span>feedback items handled</span></div>
          <div class="stat"><b>${totalMin} min</b><span>total agent time</span></div>
          <div class="stat"><b>${tokens ? Math.round(tokens / 1000) + "k" : "–"}</b><span>tokens${cost ? " · ~$" + cost.toFixed(2) : ""}</span></div>
        </div>
        <p class="muted small" style="margin:8px 0 0">Tokens and cost are filled in only when they can be measured, which isn't always possible for scheduled runs. Runs are covered by Matija's Claude subscription usage rather than billed separately.</p>
      </div>
      ${runs.map(r => `<div class="card">
        <div class="item-head"><b>${time(r)}</b><span class="tag">${r.by === "scheduled" ? "🤖 scheduled" : "💬 manual"}</span></div>
        <p style="margin:6px 0">${esc(r.summary)}</p>
        <div class="item-meta">${mins(r)} min · ${esc(r.model || "")} · issues ${(r.issues || []).map(n => `<a href="https://github.com/okmatija/corl2026/issues/${n}" target="_blank" rel="noopener">#${n}</a>`).join(" ")}${r.tokens ? ` · ${Math.round(r.tokens / 1000)}k tokens` : ""}${r.costUsd ? ` · ~$${r.costUsd.toFixed(2)}` : ""}</div>
      </div>`).join("") || '<p class="muted">No updates yet.</p>'}
    `;
  }

  function statusBanner() {
    if (loadState === "off") return '<div class="banner">Feedback service not connected yet - voting is disabled.</div>';
    if (loadState === "error") return '<div class="banner">Couldn\'t load the latest feedback (showing last saved copy).</div>';
    return "";
  }

  // ---------- dialog ----------
  function ask({ title, body, placeholder, input, ok = "OK" }) {
    return new Promise(resolve => {
      const dlg = document.getElementById("dlg");
      dlg.querySelector("h3").textContent = title;
      dlg.querySelector("p").textContent = body || "";
      const ta = dlg.querySelector("textarea");
      const inp = dlg.querySelector("input");
      ta.hidden = !!input; inp.hidden = !input;
      ta.value = ""; inp.value = "";
      (input ? inp : ta).placeholder = placeholder || "";
      dlg.querySelector("button[value=ok]").textContent = ok;
      dlg.returnValue = "";
      dlg.onclose = () => resolve(dlg.returnValue === "ok" ? (input ? inp.value : ta.value) : null);
      dlg.showModal();
    });
  }

  // ---------- shell ----------
  function route() {
    const tab = (location.hash.slice(1) || "plan").toLowerCase();
    const person = PEOPLE.find(p => p.toLowerCase() === tab);
    if (person) return { tab, render: () => viewPerson(person) };
    if (tab === "ideas") return { tab, render: viewIdeas };
    if (tab === "updates") return { tab, render: viewUpdates };
    if (tab === "austin") return { tab, render: viewAustin };
    return { tab: "plan", render: viewPlan };
  }

  function render(keepScroll) {
    const y = window.scrollY;
    const r = route();
    // keep a half-typed free-text note across re-renders
    const draft = document.getElementById("freeText")?.value;
    document.getElementById("view").innerHTML = r.render();
    if (draft && document.getElementById("freeText")) document.getElementById("freeText").value = draft;
    document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("active", a.dataset.tab === r.tab));
    // Others' feedback is hidden by default on Plan/Ideas to reduce clutter; person tabs always show it.
    document.getElementById("view").classList.toggle("hide-fb", !ui.showFb && ["plan", "ideas"].includes(r.tab));
    if (r.tab === "plan" || r.tab === "austin") drawMap(); else if (map) { map.remove(); map = null; }
    window.scrollTo(0, keepScroll ? y : 0);
    document.getElementById("whoBtn").textContent = who ? "👤 " + who : "👤 Who are you?";
  }
  const rerender = () => render(true);

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
  }

  document.addEventListener("click", async e => {
    const el = e.target.closest("button");
    if (!el) return;
    const ds = el.dataset;
    if (el.id === "whoBtn") {
      who = PEOPLE[(PEOPLE.indexOf(who) + 1) % PEOPLE.length];
      store.set("who", who); toast("You are " + who); return rerender();
    }
    if (ds.filter) { ui.filter = ds.filter; store.set("ui", ui); return rerender(); }
    if ("togglefb" in ds) { ui.showFb = !ui.showFb; store.set("ui", ui); return rerender(); }
    if (ds.vote) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const idea = ideas[ds.idea];
      const text = await ask({ title: `${vIcon(ds.vote)} ${idea.title}`, body: `Voting as ${who}. Reason (optional):`, placeholder: ds.vote === "up" ? "Why do you like it?" : "Why not?", ok: "Send" });
      if (text === null) return;
      el.disabled = true;
      await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: ds.vote, text: text.trim() });
      el.disabled = false;
    }
    if (ds.planvote) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const note = ds.planvote === "note";
      const text = await ask({ title: `${vIcon(ds.planvote)} ${ds.title}`, body: note ? `Comment as ${who}:` : `Feedback on the plan as ${who}. Reason (optional):`,
        placeholder: note ? "Question, idea, anything…" : ds.planvote === "up" ? "What do you like?" : "What should change?", ok: "Send" });
      if (text === null || (note && !text.trim())) return;
      el.disabled = true;
      await submit({ who, kind: "plan", target: ds.target, targetTitle: ds.title, vote: ds.planvote, text: text.trim() });
      el.disabled = false;
    }
    if (ds.answer) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const q = T.openQuestions[+ds.answer];
      const text = (await ask({ title: "💬 " + q, body: `Answering as ${who}:`, placeholder: "Your answer", ok: "Send" }))?.trim();
      if (!text) return;
      el.disabled = true;
      await submit({ who, kind: "general", text: `Q: ${q}\nA: ${text}` });
      el.disabled = false;
    }
    if (ds.send) {
      const text = document.getElementById("freeText").value.trim();
      if (!text) { toast("Write something first"); return; }
      el.disabled = true;
      if (await submit({ who: ds.send, kind: "general", text })) { const t = document.getElementById("freeText"); if (t) t.value = ""; }
      el.disabled = false;
    }
  });
  document.addEventListener("change", e => {
    if (e.target.id === "region") { ui.region = e.target.value; store.set("ui", ui); rerender(); }
  });

  window.addEventListener("hashchange", () => render(false));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadFeedback(); });
  render(false);
  loadFeedback();
})();
