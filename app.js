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
  let dlgModel = "haiku";   // model picked in the last feedback dialog

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
  const STATES = { TX: "texas", FL: "florida", NY: "new york", CA: "california", NV: "nevada", AZ: "arizona", UT: "utah", LA: "louisiana", PR: "puerto rico" };
  const TYPE_ICON ={ city: "🏙️", nature: "🌲", beach: "🏖️" };
  const placeLabel = id => `${TYPE_ICON[place(id).type] || "📍"} ${place(id).name}`;
  // Which Claude model actions a piece of feedback (each has its own hourly routine). Small model is the default.
  const MODELS = [["haiku", "🤖 Haiku"], ["sonnet", "🤖 Sonnet"], ["opus", "🤖 Opus"]];
  const modelOptions = sel => MODELS.map(([k, l]) => `<option value="${k}" ${k === sel ? "selected" : ""}>${l}</option>`).join("");
  const MODEL_NAME = { haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" };
  const when = iso => iso.length <= 10 ? fmt(iso) : new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const tint = name => name ? "tint-" + name.toLowerCase() : "";
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
        const items = (l.days?.[k] || []).map(s => esc(s).replace(idPattern, id => `<b>${esc(ideas[id].title)}</b>`));
        const lines = [...obl, ...items];
        const key = "day:" + date;
        const dayTitle = `${fmt(date)} in ${short(l.place)}`;
        return `<div class="day"><div class="date"><b>${fmt(date, { weekday: "short" })}</b>${fmt(date, { day: "numeric", month: "short" })}
          <div class="mini">${voteBtn(key, dayTitle, "up", true)}${voteBtn(key, dayTitle, "down", true)}</div></div>
          <div><ul>${lines.map(x => `<li>${x}</li>`).join("") || "<li class='muted'>Free</li>"}</ul></div></div>`;
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
            <div class="vote">${["up", "down", "note"].map(dir => voteBtn("stop:" + l.place, `Stop: ${p.name}`, dir)).join("")}</div>
          </div>
        </div>`;
    }).join("");
    const end = P.end || { date: P.legs.at(-1).leave, text: "" };

    return `
      <div class="card accent">
        <h2>Trip Summary</h2>
        <p class="muted" style="margin:4px 0">${esc(P.summary)}</p>
        <div class="stats">
          <div class="stat"><b>${fmt(P.legs[0].arrive, { day: "numeric", month: "short" })} – ${fmt(end.date, { day: "numeric", month: "short" })}</b><span>${nights} nights</span></div>
          <div class="stat"><b>${money(lodging)}</b><span>our lodging est. (excl. work-paid nights) · budget ${money(P.budgetPerNight)}/nt</span></div>
        </div>
        <p class="muted small" style="margin:10px 0 0">Updated ${esc(when(T.meta.updated))} · 🤖 Claude checks feedback ${esc(window.AUTOMATION?.schedule || "")} · <a href="#about">ⓘ About & history</a></p>
      </div>
      ${T.openQuestions?.length ? `<div class="card"><h3>Open questions</h3>${T.openQuestions.map((q, i) => `
        <div class="question">
          <div class="q-row"><span>${esc(q)}</span><button class="q-btn" data-answer="${i}" aria-label="Answer this question">💬 Answer</button></div>
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
      <div class="banner info">🏃‍♀️ <b>Morning runs for Maryna:</b> the best and safest running is the Ann &amp; Roy Butler Hike-and-Bike Trail around Lady Bird Lake. There's a 3-mile loop (Congress Ave - Lamar bridges) or the full 10-mile loop, and it's busy with runners from about 6am. Sunrise is around 6:50am in mid-November and parts of the trail are unlit, so best to go at first light. Hotels by the lake (⭐ below) put you right on it. This is my assessment; check recent reviews too.</div>
      <div id="amap" role="img" aria-label="Map of Austin venues and hotels"></div>
      <div class="card"><h3>💼 Work</h3>${A.work.map(w => `<div class="item"><a class="item-title" href="${gmaps(w.address)}" target="_blank" rel="noopener">${esc(w.name)}</a><div class="item-meta">${esc(w.address)}</div></div>`).join("")}</div>
      <div class="card"><h3>🛏️ Hotel options</h3>${A.hotels.slice().sort((a, b) => km(a, jw) - km(b, jw)).map(h => `<div class="item">
        <div class="item-head"><a class="item-title" href="${gmaps(h.name + ", " + h.address)}" target="_blank" rel="noopener">${esc(h.name)}</a><span class="tag">~${money(h.price)}/nt</span></div>
        <div class="item-meta">${esc(dist(h))}${h.note ? " · " + esc(h.note) : ""}</div>
        ${h.run ? `<div class="run">🏃‍♀️ ${esc(h.run)}</div>` : ""}</div>`).join("")}
        <p class="muted small" style="margin:8px 0 0">Matija's work covers his room for 7-13 Nov, so this mostly matters for where you'd like to be based.</p></div>`;
  }

  function drawAustinMap(el) {
    const A = T.austinMap;
    map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
    const pin = (p, cls, label) => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: "", html: `<div class="apin ${cls}">${label}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] }),
      zIndexOffset: cls === "work" ? 1000 : 0,
    }).addTo(map).bindPopup(`<b>${esc(p.name)}</b><br>${p.price ? `~${money(p.price)}/nt<br>` : ""}${p.run ? `🏃‍♀️ ${esc(p.run)}<br>` : ""}<a href="${gmaps(p.name + ", " + p.address)}" target="_blank" rel="noopener">Open in Google Maps</a>`);
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
    const state = STATES[place(a.place).name.split(", ").pop()] || "";
    const text = norm([a.title, a.why, place(a.place).name, state, place(a.place).type, a.cat, CATS[a.cat], a.cost, a.dur, inPlan.has(a.id) ? "in plan" : ""].join(" "));
    return `<article class="idea" data-text="${esc(text)}">
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

  const isAnswer = f => f.kind === "general" && /^Q: [\s\S]*\nA: /.test(f.text || "");

  function voteChips(v) {
    return PEOPLE.filter(p => v[p]).map(p => `
      <div class="fb ${v[p].vote}"><b>${esc(p)} ${vIcon(v[p].vote)}</b>${v[p].text ? ` ${esc(v[p].text)}` : ""}</div>`).join("");
  }

  // Like/Dislike/Comment button for a plan stop or day. mini = icon-only (day rows).
  // No "selected" state: the plan view doesn't display feedback, so a highlighted button would just look stuck.
  function voteBtn(key, title, dir, mini) {
    const label = { up: "Like", down: "Dislike", note: "Comment" }[dir];
    return `<button data-planvote="${dir}" data-target="${esc(key)}" data-title="${esc(title)}" aria-label="${label} ${esc(title)}">${vIcon(dir)}${mini ? "" : " " + label}</button>`;
  }

  function viewIdeas() {
    const regions = [...new Set(T.ideas.map(a => a.place))];
    const list = T.ideas.filter(a => (ui.region === "all" || a.place === ui.region) && matches(a));
    const groups = regions.map(r => ({ r, items: list.filter(a => a.place === r) })).filter(g => g.items.length);
    return `
      <h2>Ideas</h2>
      <div class="banner info">💡 These cards are suggestions from Claude. Want more, or something specific? Ask on the <a href="#feedback">💬 Feedback</a> tab (e.g. "ideas for a rainy day in Austin") and the hourly agent will add new cards. 👍 / 👎 on a card tells it what to put into the plan.</div>
      ${statusBanner()}
      <div class="chips">${FILTERS.map(([k, l]) => `<button class="chip ${ui.filter === k ? "on" : ""}" data-filter="${esc(k)}">${esc(l)}</button>`).join("")}</div>
      <input type="search" id="ideaSearch" placeholder="🔍 Search ideas (e.g. gators, rock, beach)" value="${esc(ui.q || "")}" autocomplete="off" aria-label="Search ideas">
      <select id="region" aria-label="Region"><option value="all">All places</option>${regions.map(r => `<option value="${r}" ${ui.region === r ? "selected" : ""}>${esc(placeLabel(r))}</option>`).join("")}</select>
      <p class="muted small" id="ideaCount">${list.length} idea${list.length === 1 ? "" : "s"}</p>
      ${groups.map(g => `<section class="region-group"><h3 class="region">${esc(placeLabel(g.r))}</h3>${g.items.map(ideaCard).join("")}</section>`).join("") || '<p class="muted">Nothing matches this filter.</p>'}
      <p class="muted" id="noMatch" hidden>No ideas match your search.</p>
    `;
  }

  // ---------- fuzzy search (Ideas page) ----------
  // Every query word must appear in the card, either as a substring or as a word within a small edit distance
  // (1 typo for words of 4+ letters, 2 for 7+), so "aligator", "nascr" or "disny" still match.
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9$ ]+/g, " ");
  function editDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (Math.min(...cur) > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function fuzzyMatch(text, words) {
    const tokens = text.split(" ").filter(Boolean);
    return words.every(w => {
      if (text.includes(w)) return true;
      const max = w.length >= 7 ? 2 : w.length >= 4 ? 1 : 0;
      return max > 0 && tokens.some(t => editDistance(w, t.slice(0, w.length + max), max) <= max);
    });
  }
  function applySearch() {
    const input = document.getElementById("ideaSearch");
    if (!input) return;
    const words = norm(input.value).split(" ").filter(w => w.length > 1);
    let shown = 0;
    document.querySelectorAll(".region-group").forEach(g => {
      let any = false;
      g.querySelectorAll(".idea").forEach(card => {
        const ok = !words.length || fuzzyMatch(card.dataset.text, words);
        card.hidden = !ok;
        if (ok) { any = true; shown++; }
      });
      g.hidden = !any;
    });
    document.getElementById("ideaCount").textContent = `${shown} idea${shown === 1 ? "" : "s"}`;
    document.getElementById("noMatch").hidden = shown > 0 || !words.length;
  }

  function fbLabel(f) {
    if (f.kind === "idea") return `${vIcon(f.vote)} <b>${esc(f.ideaTitle || ideas[f.idea]?.title || f.idea)}</b>`;
    if (f.kind === "plan") return `${vIcon(f.vote)} <b>Plan · ${esc(f.targetTitle || f.target)}</b>`;
    if (f.kind === "reply") return `💬 <b>Reply to ${esc(f.replyToWho || "")} · #${f.replyTo}</b>`;
    if (isAnswer(f)) return `💬 <b>Answer · ${esc(f.text.slice(3).split("\nA: ")[0])}</b>`;
    return "💬 <b>General</b>";
  }
  const fbText = f => isAnswer(f) ? f.text.split("\nA: ").slice(1).join("\nA: ") : f.text;
  const replies = n => feedback.filter(r => r.kind === "reply" && r.replyTo === n).sort((a, b) => a.date.localeCompare(b.date));

  // 👍 / 👎 votes vs everything written (general notes, answers, replies, plan comments)
  const fbType = f => f.vote === "up" ? "up" : f.vote === "down" ? "down" : "general";
  const FB_TYPES = [["general", "💬 General"], ["up", "👍"], ["down", "👎"]];

  function viewFeedback() {
    // Toggle filters: nothing selected in a group = show all of that group
    const whoSel = ui.fbWho || [], typeSel = ui.fbType || [];
    const list = feedback
      .filter(f => (!whoSel.length || whoSel.includes(f.who)) && (!typeSel.length || typeSel.includes(fbType(f))))
      .sort((a, b) => b.date.localeCompare(a.date));
    const open = list.filter(f => f.state === "open").length;
    const chip = (group, key, label, on) => `<button class="chip ${on ? "on" : ""} ${group === "fbwho" ? tint(key) + "-chip" : ""}" data-${group}="${esc(key)}" aria-pressed="${on}">${label}</button>`;
    return `
      <h2>Feedback</h2>
      ${statusBanner()}
      <div class="card composer ${tint(who)}">
        ${who ? `
        <h3>💬 Add feedback as ${esc(who)}</h3>
        <p class="muted small" style="margin:0 0 8px">Anything: must-sees, budget per night, where to stay, dates, dealbreakers… (not you? tap the name badge at the top)</p>
        <textarea id="freeText" rows="4" placeholder="e.g. Budget ~150/night. I'd love a day at the beach."></textarea>
        <div class="row send-row" style="margin-top:8px">
          <select id="freeModel" class="model-select" aria-label="Claude model to action this" title="Claude model to action this">${modelOptions("haiku")}</select>
          <button class="primary" data-send>💬 Send</button>
        </div>` : `
        <h3>💬 Add feedback</h3>
        <p class="muted small" style="margin:0 0 8px">Who are you?</p>
        <div class="row">${PEOPLE.map(p => `<button class="chip ${tint(p)}" data-setwho="${esc(p)}">👤 ${esc(p)}</button>`).join("")}</div>`}
      </div>
      <div class="chips fb-filters" role="group" aria-label="Filter feedback">
        ${PEOPLE.map(p => chip("fbwho", p, esc(p), whoSel.includes(p))).join("")}
        <span class="chip-sep"></span>
        ${FB_TYPES.map(([k, l]) => chip("fbtype", k, l, typeSel.includes(k))).join("")}
      </div>
      <p class="muted small">${list.length} item${list.length === 1 ? "" : "s"} · ${open} waiting for Claude · ${list.length - open} done</p>
      ${list.map(f => `
        <div class="card fbitem ${f.state} ${tint(f.who)}">
          <div class="item-head">
            <span><span class="who-name">${esc(f.who)}</span> ${fbLabel(f)}</span>
            <span class="tag ${f.state === "open" ? "over" : "ok"}">${f.state === "open" ? "⏳ open" : "✅ done"}</span>
          </div>
          ${f.text ? `<p>${esc(fbText(f)).replace(/\n/g, "<br>")}</p>` : ""}
          ${f.resolution ? `<p class="resolution">🤖 ${esc(f.resolution)}</p>` : ""}
          <div class="item-meta">${esc(when(f.date))}${f.model ? ` · 🤖 ${MODEL_NAME[f.model] || esc(f.model)}` : ""}${f.url ? ` · <a href="${esc(f.url)}" target="_blank" rel="noopener">#${f.number}</a>` : ""}</div>
          ${f.number ? replies(f.number).map(r => `<div class="reply ${tint(r.who)}"><b>${esc(r.who)} 💬</b> ${esc(r.text)} <span class="muted small">· ${esc(when(r.date))}</span></div>`).join("") : ""}
          ${f.number && f.kind !== "reply" ? `<div class="row end"><button class="reply-btn" data-reply="${f.number}" data-replywho="${esc(f.who)}" data-replytitle="${esc(fbLabel(f).replace(/<[^>]+>/g, ""))}">💬 Reply</button></div>` : ""}
        </div>`).join("") || '<p class="muted">No feedback yet.</p>'}
    `;
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
      <h2>About this site</h2>
      <div class="card">
        <p style="margin:0 0 8px">Matija & Maryna's plan for CoRL 2026 in Austin and the holiday afterwards. Tell Claude what you think and it updates the plan:</p>
        <ul class="plain">
          <li>👍 / 👎 - quick like or dislike (ideas, stops, days)</li>
          <li>💬 - write something: comments, answers to open questions, replies to each other, and anything else on the Feedback tab</li>
          <li>🤖 the dropdown next to Send picks which Claude model actions it: Haiku (default, small &amp; fast), Sonnet (balanced) or Opus (most thorough, for tricky requests)</li>
          <li>Pick who you are with the name badge at the top right (blue = Matija, pink = Maryna)</li>
        </ul>
      </div>
      <h2>Plan updates & usage</h2>
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
  // model: show the 🤖 model picker (its value is left in dlgModel for the caller); as: tint the dialog for that person
  function ask({ title, body, placeholder, input, ok = "OK", model, as }) {
    return new Promise(resolve => {
      const dlg = document.getElementById("dlg");
      dlg.className = tint(as);
      document.getElementById("dlgModel").hidden = !model;
      document.getElementById("dlgModel").innerHTML = modelOptions("haiku");
      dlg.querySelector("h3").textContent = title;
      dlg.querySelector("p").textContent = body || "";
      const ta = dlg.querySelector("textarea");
      const inp = dlg.querySelector("input");
      ta.hidden = !!input; inp.hidden = !input;
      ta.value = ""; inp.value = "";
      (input ? inp : ta).placeholder = placeholder || "";
      dlg.querySelector("button[value=ok]").textContent = ok;
      dlg.returnValue = "";
      dlg.onclose = () => { dlgModel = document.getElementById("dlgModel").value; resolve(dlg.returnValue === "ok" ? (input ? inp.value : ta.value) : null); };
      dlg.showModal();
    });
  }

  // ---------- shell ----------
  function route() {
    const tab = (location.hash.slice(1) || "plan").toLowerCase();
    const person = PEOPLE.find(p => p.toLowerCase() === tab);
    // Old per-person links (#matija / #maryna) open the Feedback tab filtered to that person
    if (person) { ui.fbWho = [person]; store.set("ui", ui); history.replaceState(null, "", "#feedback"); return { tab: "feedback", render: viewFeedback }; }
    if (tab === "feedback") return { tab, render: viewFeedback };
    if (tab === "ideas") return { tab, render: viewIdeas };
    if (tab === "updates" || tab === "about") return { tab: "about", render: viewUpdates };
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
    if (r.tab === "plan" || r.tab === "austin") drawMap(); else if (map) { map.remove(); map = null; }
    if (r.tab === "ideas") applySearch();
    window.scrollTo(0, keepScroll ? y : 0);
    const badge = document.getElementById("whoBtn");
    badge.textContent = who ? "👤 " + who : "👤 Who are you?";
    badge.className = "who-btn " + tint(who);
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
    if (ds.vote) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const idea = ideas[ds.idea];
      const text = await ask({ title: `${vIcon(ds.vote)} ${idea.title}`, body: `Voting as ${who}. Reason (optional):`, placeholder: ds.vote === "up" ? "Why do you like it?" : "Why not?", ok: "Send", model: true, as: who });
      if (text === null) return;
      el.disabled = true;
      await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: ds.vote, text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.planvote) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const note = ds.planvote === "note";
      const text = await ask({ title: `${vIcon(ds.planvote)} ${ds.title}`, body: note ? `Comment as ${who}:` : `Feedback on the plan as ${who}. Reason (optional):`,
        placeholder: note ? "Question, idea, anything…" : ds.planvote === "up" ? "What do you like?" : "What should change?", ok: "Send", model: true, as: who });
      if (text === null || (note && !text.trim())) return;
      el.disabled = true;
      await submit({ who, kind: "plan", target: ds.target, targetTitle: ds.title, vote: ds.planvote, text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.answer) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const q = T.openQuestions[+ds.answer];
      const text = (await ask({ title: "💬 " + q, body: `Answering as ${who}:`, placeholder: "Your answer", ok: "Send", model: true, as: who }))?.trim();
      if (!text) return;
      el.disabled = true;
      await submit({ who, kind: "general", text: `Q: ${q}\nA: ${text}`, model: dlgModel });
      el.disabled = false;
    }
    if (ds.reply) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const text = (await ask({ title: `💬 Reply to ${ds.replywho}`, body: ds.replytitle, placeholder: "Your reply", ok: "Send", model: true, as: who }))?.trim();
      if (!text) return;
      el.disabled = true;
      await submit({ who, kind: "reply", replyTo: +ds.reply, replyToWho: ds.replywho, text, model: dlgModel });
      el.disabled = false;
    }
    if (ds.fbwho || ds.fbtype) {
      const key = ds.fbwho ? "fbWho" : "fbType", v = ds.fbwho || ds.fbtype;
      const cur = new Set(ui[key] || []);
      cur.has(v) ? cur.delete(v) : cur.add(v);
      ui[key] = [...cur]; store.set("ui", ui); return rerender();
    }
    if (ds.setwho) { who = ds.setwho; store.set("who", who); return rerender(); }
    if ("send" in ds) {
      const text = document.getElementById("freeText").value.trim();
      if (!text) { toast("Write something first"); return; }
      el.disabled = true;
      if (await submit({ who, kind: "general", text, model: document.getElementById("freeModel").value })) { const t = document.getElementById("freeText"); if (t) t.value = ""; }
      el.disabled = false;
    }
  });
  document.addEventListener("change", e => {
    if (e.target.id === "region") { ui.region = e.target.value; store.set("ui", ui); rerender(); }
  });
  document.addEventListener("input", e => {
    if (e.target.id === "ideaSearch") { ui.q = e.target.value; store.set("ui", ui); applySearch(); }
  });

  window.addEventListener("hashchange", () => render(false));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadFeedback(); });
  render(false);
  loadFeedback();
})();
