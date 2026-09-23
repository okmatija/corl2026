(() => {
  "use strict";

  const T = window.TRIP;
  const REPO = "okmatija/corl2026";
  const REACTIONS = [
    { key: "love", icon: "❤️", label: "Love it" },
    { key: "like", icon: "👍", label: "Good" },
    { key: "meh", icon: "🤷", label: "Meh" },
    { key: "no", icon: "👎", label: "Skip" },
  ];
  const CATS = { nature: "🌲 Nature", food: "🍽️ Food", culture: "🏛️ Culture", music: "🎸 Music", city: "🏙️ City", night: "🌙 Night", adventure: "🧗 Adventure" };
  const INTERESTS = ["nature", "hiking", "food", "music", "art", "museums", "cities", "nightlife", "stargazing", "relaxing", "shopping", "history"];

  const activities = Object.fromEntries(T.activities.map(a => [a.id, a]));
  const stays = Object.fromEntries(T.stays.map(s => [s.id, s]));
  const variants = Object.fromEntries(T.variants.map(v => [v.id, v]));
  const idPattern = new RegExp("\\b(" + T.activities.map(a => a.id).sort((a, b) => b.length - a.length).map(s => s.replace(/[-]/g, "\\-")).join("|") + ")\\b", "g");

  // ---------- storage (never throws) ----------
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem("corl." + k); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem("corl." + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  let who = store.get("who", null);
  let pending = store.get("pending", []);
  const ui = store.get("ui", { variant: T.currentVariant, place: "all", cat: "all", stayPlace: "all" });
  let map = null;

  // Drop pending entries that have already been merged into data/feedback.js
  const merged = new Set((window.FEEDBACK || []).map(f => fbKey(f) + "|" + (f.reaction || "") + "|" + (f.note || "")));
  pending = pending.filter(f => !merged.has(fbKey(f) + "|" + (f.reaction || "") + "|" + (f.note || "")));
  store.set("pending", pending);

  function fbKey(f) { return f.who + "::" + f.target; }
  function saveUi() { store.set("ui", ui); }

  // ---------- helpers ----------
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const d = s => new Date(s + "T12:00:00");
  const iso = dt => dt.toISOString().slice(0, 10);
  const addDays = (s, n) => { const x = d(s); x.setDate(x.getDate() + n); return iso(x); };
  const nightsBetween = (a, b) => Math.round((d(b) - d(a)) / 86400000);
  const fmt = (s, opts = { weekday: "short", day: "numeric", month: "short" }) => d(s).toLocaleDateString("en-GB", opts);
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const place = id => T.places[id] || { name: id };

  function prefs(person = who || "guest") {
    const base = { ...T.settings, ...(window.PREFS?.[person] || {}) };
    return { ...base, ...(store.get("prefs." + person, {}) || {}) };
  }
  const budget = () => Number(prefs().budgetPerNight) || T.settings.budgetPerNight;

  function pickStay(leg, b = budget()) {
    const options = T.stays.filter(s => s.place === leg.place);
    const preferred = stays[leg.pick];
    if (preferred && preferred.price <= b) return preferred;
    const within = options.filter(s => s.price <= b).sort((x, y) => y.price - x.price);
    if (within.length) return within[0];
    return options.sort((x, y) => x.price - y.price)[0] || null;
  }

  function stats(v, b = budget()) {
    let nights = 0, lodging = 0, drive = 0, over = 0;
    v.legs.forEach(l => {
      const n = nightsBetween(l.arrive, l.leave);
      const s = pickStay(l, b);
      nights += n;
      if (s) { lodging += s.price * n; if (s.price > b) over++; }
      drive += l.travel?.hours || 0;
    });
    return { nights, lodging, drive, over, start: v.legs[0].arrive, end: v.end?.date || v.legs.at(-1).leave, perNight: nights ? lodging / nights : 0 };
  }

  function renderPlanText(str) {
    return esc(str).replace(idPattern, id => `<b>${esc(activities[id].title)}</b>`);
  }

  // ---------- feedback ----------
  function allFeedback(target) {
    const repo = (window.FEEDBACK || []).filter(f => f.target === target);
    const mine = pending.filter(f => f.target === target);
    // pending overrides the repo version for the same person
    const byWho = {};
    repo.forEach(f => byWho[f.who] = { ...f, sent: true });
    mine.forEach(f => byWho[f.who] = { ...f, sent: false });
    return Object.values(byWho);
  }
  function myEntry(target) {
    return pending.find(f => f.who === who && f.target === target) ||
      (window.FEEDBACK || []).find(f => f.who === who && f.target === target) || null;
  }
  function upsert(target, patch) {
    if (!who) { toast("First pick who you are"); location.hash = "#feedback"; return; }
    const current = myEntry(target) || { who, target, reaction: null, note: "" };
    const next = { ...current, ...patch, who, target, date: iso(new Date()) };
    delete next.sent;
    pending = pending.filter(f => !(f.who === who && f.target === target));
    if (next.reaction || next.note) pending.push(next);
    store.set("pending", pending);
    updateBadge();
  }

  function reactBar(target) {
    const mine = who ? myEntry(target) : null;
    const others = allFeedback(target);
    const btns = REACTIONS.map(r => `<button type="button" data-react="${r.key}" data-target="${esc(target)}" class="${mine?.reaction === r.key ? "on" : ""}" aria-label="${r.label}" title="${r.label}">${r.icon}</button>`).join("");
    const chips = others.filter(f => f.reaction || f.note).map(f => {
      const icon = REACTIONS.find(r => r.key === f.reaction)?.icon || "💬";
      return `<span class="fb ${f.sent ? "" : "mine"}" title="${f.sent ? "received" : "not sent yet"}">${esc(f.who)} ${icon}${f.note ? " · " + esc(f.note) : ""}</span>`;
    }).join("");
    return `<div class="react">${btns}<button type="button" class="note-btn" data-note="${esc(target)}">✏️ Note</button></div>${chips ? `<div class="others">${chips}</div>` : ""}`;
  }

  function reactionSummary(target) {
    return allFeedback(target).filter(f => f.reaction).map(f => `${esc(f.who)} ${REACTIONS.find(r => r.key === f.reaction).icon}`).join(" · ") || '<span class="muted">No votes yet</span>';
  }

  // ---------- views ----------
  function viewPlan() {
    const v = variants[ui.variant] || variants[T.currentVariant];
    const s = stats(v);
    const b = budget();
    const chips = T.variants.map(x => `<button class="chip ${x.id === v.id ? "on" : ""}" data-variant="${x.id}">${x.emoji} ${esc(x.name)}${x.id === T.currentVariant ? " ★" : ""}</button>`).join("");

    const legs = v.legs.map((l, i) => {
      const n = nightsBetween(l.arrive, l.leave);
      const p = place(l.place);
      const chosen = pickStay(l, b);
      const alts = T.stays.filter(x => x.place === l.place && x !== chosen);
      const acts = T.activities.filter(a => a.place === l.place);
      const days = Array.from({ length: n }, (_, k) => {
        const date = addDays(l.arrive, k);
        const obl = T.obligations.filter(o => date >= o.start && date <= o.end);
        const items = (l.days?.[k] || []).map(renderPlanText);
        const lines = [...obl.map(o => `<span class="oblig">${esc(o.title)}</span>`), ...items];
        return `<div class="day"><div class="date"><b>${fmt(date, { weekday: "short" })}</b>${fmt(date, { day: "numeric", month: "short" })}</div><ul>${lines.map(x => `<li>${x}</li>`).join("") || "<li class='muted'>Free</li>"}</ul></div>`;
      }).join("");
      return `
        <div class="leg">
          <div class="dot">${i + 1}</div>
          <div class="travel">${l.travel?.mode === "flight" ? "✈️" : l.travel?.mode === "car" ? "🚗" : "➡️"} ${esc(l.travel?.text || "")}${i > 0 ? ` · <a href="${dirUrl(v.legs[i - 1].place, l.place)}" target="_blank" rel="noopener">route</a>` : ""}</div>
          <div class="card">
            <div class="item-head"><h3>${esc(p.name)}</h3><span class="tag">${n} night${n > 1 ? "s" : ""}</span></div>
            <div class="item-meta">${fmt(l.arrive)} → ${fmt(l.leave)} · ${esc(p.blurb || "")}</div>
            ${chosen ? `<div class="item" style="border:0;padding-bottom:0">
              <div class="item-head"><span>🛏️ ${esc(chosen.name)}</span><span class="tag ${chosen.price <= b ? "ok" : "over"}">~${money(chosen.price)}/nt</span></div>
              <div class="item-meta">${esc(chosen.area)}${chosen.notes ? " · " + esc(chosen.notes) : ""}${alts.length ? ` · <a href="#stays" data-stayplace="${l.place}">${alts.length} other option${alts.length > 1 ? "s" : ""}</a>` : ""}</div>
            </div>` : ""}
            <details open><summary>Day by day</summary>${days}</details>
            <details><summary>All ideas in ${esc(p.name.split(",")[0])} (${acts.length})</summary>
              ${acts.map(activityItem).join("")}
            </details>
            <details><summary>Feedback on this stop</summary>${reactBar("place:" + l.place)}</details>
          </div>
        </div>`;
    }).join("");

    return `
      <div class="chips" role="tablist">${chips}</div>
      ${v.id === T.currentVariant ? `<div class="banner info">★ This is the <b>current plan</b>. ${esc(T.meta.status)}</div>` : `<div class="banner">Alternative variant. The current plan is ★ ${esc(variants[T.currentVariant].name)}.</div>`}
      <div class="card accent">
        <h2>${v.emoji} ${esc(v.name)}</h2>
        <p class="muted" style="margin:4px 0">${esc(v.summary)}</p>
        <div class="stats">
          <div class="stat"><b>${fmt(s.start, { day: "numeric", month: "short" })} – ${fmt(s.end, { day: "numeric", month: "short" })}</b><span>${s.nights} nights</span></div>
          <div class="stat"><b>${money(s.lodging)}</b><span>lodging est. (~${money(s.perNight)}/nt)</span></div>
          <div class="stat"><b>${s.drive ? s.drive + " h" : "–"}</b><span>total driving</span></div>
          <div class="stat"><b>${money(b)}</b><span>budget/night ${s.over ? `· <span style="color:var(--warn)">${s.over} stop${s.over > 1 ? "s" : ""} over</span>` : "· all within"}</span></div>
        </div>
        <details><summary>Pros & cons</summary>
          <ul class="plain">${v.pros.map(x => `<li>✅ ${esc(x)}</li>`).join("")}${v.cons.map(x => `<li>⚠️ ${esc(x)}</li>`).join("")}</ul>
        </details>
        <details open><summary>What do you think of this variant?</summary>${reactBar("variant:" + v.id)}</details>
      </div>
      <div id="map" role="img" aria-label="Route map"></div>
      ${legs}
      <div class="leg"><div class="dot">✓</div><div class="travel">🏁 ${fmt(v.end.date)} · ${esc(v.end.text)}</div></div>
    `;
  }

  function dirUrl(from, to) {
    const a = place(from), b = place(to);
    return `https://www.google.com/maps/dir/?api=1&origin=${a.lat},${a.lng}&destination=${b.lat},${b.lng}`;
  }

  function activityItem(a) {
    const q = encodeURIComponent(a.title.replace(/\(.*?\)/g, "") + " " + place(a.place).name);
    return `<div class="item">
      <div class="item-head"><span class="item-title">${esc(a.title)}</span><span class="tag">${esc(a.cost)}</span></div>
      <div class="item-meta">${CATS[a.cat] || ""} · ${esc(a.dur)} · ${esc(a.why)} <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">map</a></div>
      ${reactBar("activity:" + a.id)}
    </div>`;
  }

  function drawMap() {
    if (map) { map.remove(); map = null; }
    const el = document.getElementById("map");
    if (!el) return;
    if (!window.L) { el.innerHTML = '<p class="muted" style="padding:12px">Map unavailable offline.</p>'; return; }
    const v = variants[ui.variant] || variants[T.currentVariant];
    const pts = v.legs.map(l => place(l.place)).filter(p => p.lat);
    map = L.map(el, { scrollWheelZoom: false, tap: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    const latlngs = pts.map(p => [p.lat, p.lng]);
    L.polyline(latlngs, { color: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c2410c", weight: 3, dashArray: "6 6" }).addTo(map);
    pts.forEach((p, i) => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: "", html: `<div class="dot" style="position:static;width:24px;height:24px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font:700 12px sans-serif;border:2px solid #fff">${i + 1}</div>`, iconSize: [24, 24], iconAnchor: [12, 12] }),
    }).addTo(map).bindPopup(esc(p.name)));
    map.fitBounds(latlngs, { padding: [30, 30] });
  }

  function viewCompare() {
    const b = budget();
    const cols = T.variants.map(v => ({ v, s: stats(v, b) }));
    const row = (label, fn) => `<tr><td>${label}</td>${cols.map(fn).join("")}</tr>`;
    return `
      <h2>Compare variants</h2>
      <p class="muted small">Lodging uses your budget of ${money(b)}/night to pick a stay at each stop. Change it on the Stays or Feedback tab.</p>
      <div class="card compare-wrap"><table class="compare">
        <tr><th></th>${cols.map(({ v }) => `<th>${v.emoji} ${esc(v.name)}${v.id === T.currentVariant ? ' <span class="tag star">current</span>' : ""}</th>`).join("")}</tr>
        ${row("Route", ({ v }) => `<td>${v.legs.map(l => esc(place(l.place).name.split(",")[0].split(" (")[0])).join(" → ")}</td>`)}
        ${row("Dates", ({ s }) => `<td>${fmt(s.start, { day: "numeric", month: "short" })} – ${fmt(s.end, { day: "numeric", month: "short" })}<br><span class="muted">${s.nights} nights</span></td>`)}
        ${row("Lodging", ({ s }) => `<td><b>${money(s.lodging)}</b><br><span class="muted">${s.over ? s.over + " stop(s) over budget" : "all within budget"}</span></td>`)}
        ${row("Driving", ({ s }) => `<td>${s.drive ? s.drive + " h" : "none"}</td>`)}
        ${row("Pros", ({ v }) => `<td><ul class="plain">${v.pros.map(x => `<li>${esc(x)}</li>`).join("")}</ul></td>`)}
        ${row("Cons", ({ v }) => `<td><ul class="plain">${v.cons.map(x => `<li>${esc(x)}</li>`).join("")}</ul></td>`)}
        ${row("Votes", ({ v }) => `<td>${reactionSummary("variant:" + v.id)}</td>`)}
        ${row("", ({ v }) => `<td><button class="ghost" data-variant="${v.id}" data-go="plan">View</button></td>`)}
      </table></div>
      <div class="card"><h3>Vote</h3>${T.variants.map(v => `<div class="item"><span class="item-title">${v.emoji} ${esc(v.name)}</span>${reactBar("variant:" + v.id)}</div>`).join("")}</div>
    `;
  }

  function usedPlaces() {
    const seen = [];
    T.variants.forEach(v => v.legs.forEach(l => { if (!seen.includes(l.place)) seen.push(l.place); }));
    return seen;
  }

  function viewIdeas() {
    const places = usedPlaces();
    const list = T.activities.filter(a => (ui.place === "all" || a.place === ui.place) && (ui.cat === "all" || a.cat === ui.cat));
    const groups = places.map(p => ({ p, items: list.filter(a => a.place === p) })).filter(g => g.items.length);
    return `
      <h2>Ideas & things to do</h2>
      <p class="muted small">React to anything - ❤️ must do, 👍 nice, 🤷 meh, 👎 skip. Your reactions shape the next version of the plan.</p>
      <div class="chips"><button class="chip ${ui.place === "all" ? "on" : ""}" data-place="all">All places</button>${places.map(p => `<button class="chip ${ui.place === p ? "on" : ""}" data-place="${p}">${esc(place(p).name.split(",")[0])}</button>`).join("")}</div>
      <div class="chips"><button class="chip ${ui.cat === "all" ? "on" : ""}" data-cat="all">Everything</button>${Object.entries(CATS).map(([k, l]) => `<button class="chip ${ui.cat === k ? "on" : ""}" data-cat="${k}">${l}</button>`).join("")}</div>
      ${groups.map(g => `<div class="card"><h3>${esc(place(g.p).name)}</h3>${g.items.map(activityItem).join("")}</div>`).join("") || '<p class="muted">Nothing matches.</p>'}
      <div class="card"><h3>Something missing?</h3><p class="muted small">Add a wish - a place, an activity, a restaurant - and it'll get worked into the plan.</p>${reactBar("general")}</div>
    `;
  }

  function viewStays() {
    const b = budget();
    const places = usedPlaces();
    const list = T.stays.filter(s => ui.stayPlace === "all" || s.place === ui.stayPlace);
    return `
      <h2>Where to stay</h2>
      <div class="card">
        <label class="field"><span>Budget per night: <b id="budgetOut">${money(b)}</b></span>
          <input type="range" id="budgetRange" min="60" max="600" step="10" value="${b}"></label>
        <p class="muted small" style="margin:0">Prices are rough estimates for mid-November - always check live rates. Green = within budget.</p>
      </div>
      <div class="chips"><button class="chip ${ui.stayPlace === "all" ? "on" : ""}" data-stayplace="all">All</button>${places.map(p => `<button class="chip ${ui.stayPlace === p ? "on" : ""}" data-stayplace="${p}">${esc(place(p).name.split(",")[0])}</button>`).join("")}</div>
      ${places.map(p => {
        const items = list.filter(s => s.place === p).sort((x, y) => x.price - y.price);
        if (!items.length) return "";
        return `<div class="card"><h3>${esc(place(p).name)}</h3>${items.map(s => {
          const q = encodeURIComponent(s.name.replace(/\(.*?\)/g, "") + " " + place(p).name);
          return `<div class="item">
            <div class="item-head"><span class="item-title">${esc(s.name)}</span><span class="tag ${s.price <= b ? "ok" : "over"}">~${money(s.price)}/nt</span></div>
            <div class="item-meta">${esc(s.kind)} · ${esc(s.area)}${s.notes ? " · " + esc(s.notes) : ""} · <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">map</a> · <a href="https://www.google.com/travel/hotels?q=${q}" target="_blank" rel="noopener">prices</a></div>
            ${reactBar("stay:" + s.id)}
          </div>`;
        }).join("")}</div>`;
      }).join("")}
    `;
  }

  function viewFeedback() {
    const p = prefs();
    const mine = pending.filter(f => f.who === who);
    const received = (window.FEEDBACK || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const interests = new Set(p.interests || []);
    return `
      <h2>Feedback</h2>
      <div class="card">
        <h3>Who are you?</h3>
        <div class="chips">${T.meta.travellers.map(n => `<button class="chip ${who === n ? "on" : ""}" data-who="${esc(n)}">${esc(n)}</button>`).join("")}</div>
        <p class="muted small" style="margin:0">Saved on this device only.</p>
      </div>
      ${who ? `
      <div class="card">
        <h3>${esc(who)}'s preferences</h3>
        <div class="grid2">
          <label class="field"><span>Budget per night (USD)</span><input type="number" inputmode="numeric" min="0" step="10" data-pref="budgetPerNight" value="${esc(p.budgetPerNight)}"></label>
          <label class="field"><span>Max driving per day (hours)</span><input type="number" inputmode="decimal" min="0" step="0.5" data-pref="maxDriveHoursPerDay" value="${esc(p.maxDriveHoursPerDay)}"></label>
          <label class="field"><span>Pace</span><select data-pref="pace">${["relaxed", "balanced", "packed"].map(x => `<option ${p.pace === x ? "selected" : ""}>${x}</option>`).join("")}</select></label>
          <label class="field"><span>Latest date to fly home</span><input type="text" placeholder="e.g. 2026-11-22" data-pref="latestReturn" value="${esc(p.latestReturn || "")}"></label>
        </div>
        <label class="field"><span>Interests</span></label>
        <div class="chips" style="flex-wrap:wrap">${INTERESTS.map(i => `<button class="chip ${interests.has(i) ? "on" : ""}" data-interest="${i}">${i}</button>`).join("")}</div>
        <label class="field"><span>Anything else? (must-sees, dealbreakers, food, how you like to travel…)</span><textarea rows="3" data-pref="wishes">${esc(p.wishes || "")}</textarea></label>
      </div>
      <div class="card accent">
        <h3>Send your feedback</h3>
        <p class="muted small">${mine.length} reaction${mine.length === 1 ? "" : "s"}/note${mine.length === 1 ? "" : "s"} not sent yet, plus your preferences. Share them with Matija (e.g. WhatsApp) - they get pasted to Claude, who updates the plan.</p>
        <div class="row">
          <button class="primary" data-action="share">📤 Share</button>
          <button class="ghost" data-action="copy">📋 Copy</button>
          <button class="ghost" data-action="issue">🐙 GitHub issue</button>
        </div>
        ${mine.length ? `<div style="margin-top:12px">${mine.map(f => `<div class="item"><div class="item-head"><span>${REACTIONS.find(r => r.key === f.reaction)?.icon || "💬"} ${esc(targetLabel(f.target))}</span><button class="danger" data-remove="${esc(f.target)}">remove</button></div>${f.note ? `<div class="item-meta">${esc(f.note)}</div>` : ""}</div>`).join("")}
          <div class="row end"><button class="danger" data-action="clear">Clear all unsent</button></div></div>` : ""}
      </div>` : `<div class="banner">Pick who you are to vote and add notes.</div>`}
      <div class="card">
        <h3>Open questions</h3>
        <ul class="plain">${T.openQuestions.map(q => `<li>${esc(q)}</li>`).join("")}</ul>
        <p class="muted small" style="margin:0">Answer these in the "Anything else?" box.</p>
      </div>
      <div class="card">
        <h3>Received feedback (${received.length})</h3>
        ${received.length ? received.map(f => `<div class="item"><div class="item-head"><span>${esc(f.who)} ${REACTIONS.find(r => r.key === f.reaction)?.icon || "💬"} ${esc(targetLabel(f.target))}</span><span class="muted small">${esc(f.date || "")}</span></div>${f.note ? `<div class="item-meta">${esc(f.note)}</div>` : ""}</div>`).join("") : '<p class="muted small" style="margin:0">Nothing merged yet.</p>'}
      </div>
      <p class="muted small">Plan last updated ${esc(T.meta.updated)}.</p>
    `;
  }

  function targetLabel(t) {
    const [kind, id] = t.split(":");
    if (kind === "variant") return "Variant: " + (variants[id]?.name || id);
    if (kind === "activity") return activities[id]?.title || id;
    if (kind === "stay") return "Stay: " + (stays[id]?.name || id);
    if (kind === "place") return "Stop: " + place(id).name;
    return "General wish";
  }

  // ---------- export ----------
  function exportPayload() {
    const mine = pending.filter(f => f.who === who);
    const p = store.get("prefs." + who, {});
    const lines = [`CoRL trip feedback from ${who} (${iso(new Date())})`];
    if (Object.keys(p).length) {
      lines.push("", "Preferences:");
      Object.entries(p).forEach(([k, v]) => lines.push(`• ${k}: ${Array.isArray(v) ? v.join(", ") : v}`));
    }
    if (mine.length) {
      lines.push("", "Reactions & notes:");
      mine.forEach(f => lines.push(`• ${REACTIONS.find(r => r.key === f.reaction)?.icon || "💬"} ${targetLabel(f.target)}${f.note ? ` - "${f.note}"` : ""}`));
    }
    lines.push("", "---data---", JSON.stringify({ who, date: iso(new Date()), prefs: p, feedback: mine }));
    return lines.join("\n");
  }

  async function doExport(kind) {
    const text = exportPayload();
    if (kind === "share" && navigator.share) {
      try { await navigator.share({ title: "CoRL trip feedback", text }); toast("Shared 🎉"); } catch { /* cancelled */ }
      return;
    }
    if (kind === "issue") {
      const url = `https://github.com/${REPO}/issues/new?labels=feedback&title=${encodeURIComponent("Feedback from " + who)}&body=${encodeURIComponent(text)}`;
      window.open(url.slice(0, 8000), "_blank", "noopener");
      return;
    }
    try { await navigator.clipboard.writeText(text); toast("Copied - paste it in a message"); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Copied"); } catch { toast("Copy failed"); }
      ta.remove();
    }
  }

  // ---------- shell ----------
  const views = { plan: viewPlan, compare: viewCompare, ideas: viewIdeas, stays: viewStays, feedback: viewFeedback };

  function route() {
    const [tab, arg] = (location.hash.slice(1) || "plan").split("/");
    const name = views[tab] ? tab : "plan";
    if (name === "plan" && arg && variants[arg]) { ui.variant = arg; saveUi(); }
    render(name);
  }

  function render(name, keepScroll) {
    const y = window.scrollY;
    document.getElementById("view").innerHTML = views[name]();
    document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("active", a.dataset.tab === name));
    if (name === "plan") drawMap(); else if (map) { map.remove(); map = null; }
    window.scrollTo(0, keepScroll ? y : 0);
    updateHeader();
  }
  const current = () => { const t = (location.hash.slice(1) || "plan").split("/")[0]; return views[t] ? t : "plan"; };
  const rerender = () => render(current(), true);

  function updateHeader() {
    document.getElementById("title").textContent = T.meta.title;
    document.getElementById("subtitle").textContent = `CoRL ${fmt("2026-11-09", { day: "numeric" })}–${fmt("2026-11-12", { day: "numeric", month: "short" })} · Austin`;
    document.getElementById("whoBtn").textContent = who ? "👤 " + who : "👤 Who are you?";
    updateBadge();
  }
  function updateBadge() {
    const n = pending.filter(f => f.who === who).length;
    const b = document.getElementById("pendingBadge");
    b.hidden = !n; b.textContent = n;
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function setPref(key, value) {
    const p = store.get("prefs." + (who || "guest"), {});
    if (value === "" || value == null) delete p[key]; else p[key] = value;
    store.set("prefs." + (who || "guest"), p);
  }

  function openNote(target) {
    if (!who) { toast("First pick who you are"); location.hash = "#feedback"; return; }
    const dlg = document.getElementById("noteDialog");
    const ta = document.getElementById("noteText");
    document.getElementById("noteTitle").textContent = targetLabel(target);
    ta.value = myEntry(target)?.note || "";
    dlg.onclose = () => { if (dlg.returnValue === "ok") { upsert(target, { note: ta.value.trim() }); rerender(); toast("Note saved - send it from Feedback"); } };
    dlg.showModal();
    setTimeout(() => ta.focus(), 50);
  }

  document.addEventListener("click", e => {
    const el = e.target.closest("button, a[data-stayplace]");
    if (!el) return;
    const ds = el.dataset;
    if (ds.react) {
      const cur = myEntry(ds.target)?.reaction;
      upsert(ds.target, { reaction: cur === ds.react ? null : ds.react });
      rerender();
    } else if (ds.note) openNote(ds.note);
    else if (ds.variant) { ui.variant = ds.variant; saveUi(); if (ds.go) location.hash = "#plan"; else rerender(); }
    else if (ds.place) { ui.place = ds.place; saveUi(); rerender(); }
    else if (ds.cat) { ui.cat = ds.cat; saveUi(); rerender(); }
    else if (ds.stayplace) { ui.stayPlace = ds.stayplace; saveUi(); if (el.tagName !== "A") rerender(); }
    else if (ds.who) { who = ds.who; store.set("who", who); rerender(); }
    else if (ds.interest) {
      const s = new Set(prefs().interests || []);
      s.has(ds.interest) ? s.delete(ds.interest) : s.add(ds.interest);
      setPref("interests", [...s]); rerender();
    }
    else if (ds.remove) { pending = pending.filter(f => !(f.who === who && f.target === ds.remove)); store.set("pending", pending); rerender(); }
    else if (ds.action === "clear") { if (confirm("Clear all unsent feedback?")) { pending = pending.filter(f => f.who !== who); store.set("pending", pending); rerender(); } }
    else if (ds.action) doExport(ds.action);
    else if (el.id === "whoBtn") {
      const list = T.meta.travellers; who = list[(list.indexOf(who) + 1) % list.length];
      store.set("who", who); toast("You are " + who); rerender();
    }
  });

  document.addEventListener("change", e => {
    const k = e.target.dataset?.pref;
    if (k) {
      const v = e.target.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value.trim();
      setPref(k, v); toast("Saved"); updateBadge();
    }
  });
  document.addEventListener("input", e => {
    if (e.target.id === "budgetRange") {
      const v = Number(e.target.value);
      document.getElementById("budgetOut").textContent = money(v);
      setPref("budgetPerNight", v);
    }
  });
  document.addEventListener("change", e => { if (e.target.id === "budgetRange") rerender(); });

  window.addEventListener("hashchange", route);
  route();
})();
