(() => {
  "use strict";

  const T = window.TRIP;
  const API = (window.FEEDBACK_API || "").replace(/\/$/, "");
  const PEOPLE = T.meta.travellers;
  const CATS = { nature: "🌲 Nature", food: "🍽️ Food", culture: "🏛️ Culture", music: "🎸 Music", city: "🏙️ City", night: "🌙 Night", adventure: "🧗 Adventure" };

  const ideas = Object.fromEntries(T.ideas.map(a => [a.id, a]));
  const idPattern = new RegExp("\\b(" + T.ideas.map(a => a.id).sort((a, b) => b.length - a.length).join("|") + ")\\b", "g");
  // Several alternative plans (TRIP.plans); T.plan is the one picked in the menu at the top left.
  const PLANS = T.plans || [T.plan];
  const pickPlan = id => { T.plan = PLANS.find(p => p.id === id) || PLANS[0]; };
  try { pickPlan(JSON.parse(localStorage.getItem("corl2.plan"))); } catch { pickPlan(); }
  const inPlan = new Set();
  let plannedOn = {};   // idea id -> the first plan day it's on (YYYY-MM-DD), in the current plan
  function computePlanned() {
    inPlan.clear(); plannedOn = {};
    // ideas on a journey card (a leg's travel text) count as planned on its arrive day
    T.plan.legs.forEach(l => (l.travel?.match(idPattern) || []).forEach(id => { inPlan.add(id); plannedOn[id] = plannedOn[id] || l.arrive; }));
    T.plan.legs.forEach(l => (l.days || []).forEach((items, k) => items.forEach(s => (s.match(idPattern) || []).forEach(id => {
      inPlan.add(id);
      if (!plannedOn[id]) { const dt = new Date((l.daysFrom || l.arrive) + "T12:00:00"); dt.setDate(dt.getDate() + k); plannedOn[id] = dt.toISOString().slice(0, 10); }
    }))));
  }
  computePlanned();
  // 📜 Details: the current plan's own pages first, then the shared ones
  // (a link to another plan's page - e.g. shared before switching plans - still opens it)
  const detailsFor = key => T.plan.details?.[key] || T.details?.[key] || PLANS.map(p => p.details?.[key]).find(Boolean);

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
  let dlgModel = "sonnet";   // model picked in the last feedback dialog
  let openDay = null;        // { date, title } shown in the 📜 day pop-up

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
  // Which Claude model actions a piece of feedback (each has its own hourly routine). Sonnet is the default.
  const MODELS = [["haiku", "🤖 Haiku"], ["sonnet", "🤖 Sonnet"], ["opus", "🤖 Opus"]];
  const modelOptions = sel => MODELS.map(([k, l]) => `<option value="${k}" ${k === sel ? "selected" : ""}>${l}</option>`).join("");
  const MODEL_NAME = { haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" };
  const when = iso => iso.length <= 10 ? fmt(iso) : new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const tint = name => name ? "tint-" + name.toLowerCase() : "";
  const vIcon = v => ({ add: "🗓️", remove: "🗓️", delete: "🗑️" })[v] || "💬";

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
    if (!API) { toast("Comments aren't connected yet"); return false; }
    const key = await passcode();
    if (!key) return false;
    try {
      const res = await fetch(API + "/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, plan: T.plan.id, key }) });
      const body = await res.json().catch(() => ({}));
      if (res.status === 403) { store.set("key", ""); toast("Passcode rejected - try again"); return false; }
      if (!res.ok) throw new Error(body.error || res.status);
      feedback.unshift({ ...payload, plan: T.plan.id, number: body.number, url: body.url, state: "open", date: new Date().toISOString(), resolution: null });
      store.set("feedback", feedback);
      toast("Sent ✓");
      rerender();
      return true;
    } catch (e) { toast("Couldn't send: " + e.message); return false; }
  }

  // ---------- views ----------
  // Common vs divergent plans: a leg / flight home with `who` is only that person's (blue/pink outline, and only
  // shown to that person - or to everyone when nobody is picked). Legs without `who` are shared.
  const legKey = l => l.id || l.place;
  const planEnds = () => T.plan.ends || [T.plan.end || { date: T.plan.legs.at(-1).leave, text: "" }];
  const visibleTo = x => !x.who || !who || x.who === who;
  const lastLegFor = person => T.plan.legs.map((l, i) => (!l.who || !person || l.who === person) ? i : -1).reduce((a, b) => Math.max(a, b), -1);
  const endsAfter = i => planEnds().filter(e => lastLegFor(e.who) === i);
  // number of day rows a leg shows: its nights, plus its leave day when it's someone's last stop (the departure day)
  const legDayCount = (l, i) => nightsBetween(l.daysFrom || l.arrive, l.leave) + (endsAfter(i).length ? 1 : 0);
  const outline = x => x.who ? ` only-${x.who.toLowerCase()}` : "";

  function viewPlan() {
    const P = T.plan;
    const nights = P.legs.reduce((n, l) => n + nightsBetween(l.arrive, l.leave), 0);
    const costs = costBreakdown();
    const expand = s => esc(s).replace(idPattern, ideaRef);
    let dot = 0;
    const legs = P.legs.map((l, i) => {
      if (!visibleTo(l)) return "";
      const n = nightsBetween(l.arrive, l.leave);
      const p = place(l.place);
      const key = legKey(l);
      const days = Array.from({ length: legDayCount(l, i) }, (_, k) => {
        const date = addDays(l.daysFrom || l.arrive, k);
        const obl = T.obligations.filter(o => date >= o.start && date <= o.end).map(o => `<span class="oblig">💼 ${o.who ? esc(o.who) + ": " : ""}${esc(o.title)}</span>`);
        const items = (l.days?.[k] || []).map(expand);
        const lines = [...obl, ...items];
        const key = "day:" + date;
        const dayTitle = `${fmt(date)} in ${short(l.place)}`;
        // bullets on the left; date bubble top-right with 📜 💬 under it
        return `<div class="day"><ul>${lines.map(x => `<li>${x}</li>`).join("") || "<li class='muted'>Free</li>"}</ul>
          <div class="day-side"><span class="tag date-tag">${fmt(date)}</span>
          <div class="mini"><button data-daydetails="${date}" data-title="${esc(dayTitle)}" aria-label="Idea cards for ${esc(dayTitle)}">📜</button>${commentBtn(key, dayTitle, true)}</div></div></div>`;
      }).join("");
      const s = l.stay;
      const prev = P.legs.slice(0, i).reverse().find(x => !x.who || !l.who || x.who === l.who);
      const home = endsAfter(i).filter(visibleTo).map(e => `
        ${travelCard(l.place, null, e.date, e.text, "travel:home", e)}
        <div class="leg"><div class="dot">✓</div><div class="travel">🏁 ${esc(P.home || "Home")} · ${fmt(e.date)}${e.who ? ` · ${esc(e.who)}` : ""}</div></div>`).join("");
      return `
        ${l.travel ? travelCard(prev ? prev.place : null, l.place, l.arrive, l.travel, "travel:" + key, l) : ""}
        <div class="leg">
          <div class="dot">${++dot}</div>
          <div class="card${outline(l)}">
            <div class="item-head"><h3>${esc(p.name)}</h3><span class="tag date-tag">${fmt(l.arrive)} – ${fmt(l.leave)}</span></div>
            <div class="item-meta">${n} night${n > 1 ? "s" : ""} · ${esc(p.blurb || "")}</div>
            ${s ? `<div class="stay"><div class="stay-row">
              <div><div>🛏️ ${esc(s.name)}</div>${s.notes ? `<div class="item-meta">${esc(s.notes)}</div>` : ""}</div>
              <div class="day-side">${s.covered ? '<span class="tag ok">paid by work</span>' : `<span class="tag ${s.price <= P.budgetPerNight ? "ok" : "over"}">~${money(s.price)}/nt</span>`}
                <div class="mini">${mapBtn(gmaps(s.name + ", " + p.name), "📍")}${detailsBtn("stay:" + key, "📜")}${commentBtn("stay:" + key, `Stay: ${s.name}`, true)}</div></div>
            </div></div>` : ""}
            <div class="days">${days}</div>
            <div class="vote">${detailsBtn("stop:" + key)}${commentBtn("stop:" + key, `Stop: ${p.name}${l.who ? ` (${l.who})` : ""}`)}</div>
          </div>
        </div>${home}`;
    }).join("");
    const end = { date: planEnds().map(e => e.date).sort().at(-1) };

    return `
      <div class="card accent">
        <h2>Trip Summary</h2>
        <p class="muted" style="margin:4px 0">${esc(P.summary)}</p>
        <div class="stats">
          <div class="stat"><b>${fmt(P.legs[0].arrive, { day: "numeric", month: "short" })} – ${fmt(end.date, { day: "numeric", month: "short" })}</b><span>${nights} nights</span></div>
          <div class="stat"><b>${money(costs.total)}</b><span>excl. work-paid nights, food & shopping</span></div>
        </div>
        ${costCharts(costs)}
        <p class="muted small" style="margin:10px 0 0">Updated ${esc(when(T.meta.updated))}</p>
        <div class="vote">${commentBtn("trip:summary", "Trip Summary")}</div>
      </div>
      ${T.openQuestions?.length ? `<details class="card questions-card" id="openQuestions" ${ui.qClosed ? "" : "open"}><summary><h3>Open questions (${T.openQuestions.length})</h3></summary>${T.openQuestions.map((q, i) => `
        <div class="question">
          <div class="q-row"><span>${esc(q)}</span><button class="q-btn" data-answer="${i}" aria-label="Comment on this question">💬 Comment</button></div>
        </div>`).join("")}</details>` : ""}
      <div id="map" role="img" aria-label="Route map"></div>
      ${legs}
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

  // ---------- trip cost estimate (Trip Summary pies) ----------
  // Per person cost of an idea by its $ rating (rough), x2 people. Food/shopping are not counted.
  const EVENT_COST = { free: 0, "$": 15, "$$": 50, "$$$": 150 };
  const COST_TYPES = [["flights", "✈️ Flights"], ["car", "🚗 Car hire"], ["hotels", "🛏️ Hotels"], ["events", "🎟️ Things to do"]];

  function costBreakdown() {
    const P = T.plan, byType = { flights: 0, car: 0, hotels: 0, events: 0 }, byDate = {};
    const add = (type, date, amount) => { byType[type] += amount; byDate[date] = (byDate[date] || 0) + amount; };
    P.legs.forEach(l => {
      const n = nightsBetween(l.arrive, l.leave);
      for (let k = 0; k < n; k++) add("hotels", addDays(l.arrive, k), l.stay?.covered ? 0 : (l.stay?.price || 0));
      (l.days || []).forEach((items, k) => items.forEach(item => (item.match(idPattern) || []).forEach(id => {
        add("events", addDays(l.arrive, k), 2 * (EVENT_COST[ideas[id].cost] ?? 0));
      })));
    });
    (P.costs || []).forEach(c => {
      if (c.date) return add(c.type, c.date, c.amount);
      const days = nightsBetween(c.from, c.to);
      for (let k = 0; k < days; k++) add(c.type, addDays(c.from, k), c.amount / days);
    });
    // group days by stop (a date belongs to the leg that covers it; the trip's last day to the last stop)
    const byStop = [];
    const tripEnd = planEnds().map(e => e.date).sort().at(-1);
    P.legs.forEach((l, i) => {
      const from = l.daysFrom || l.arrive, to = i === P.legs.length - 1 ? addDays(tripEnd, 1) : (P.legs[i + 1].daysFrom || P.legs[i + 1].arrive);
      const dates = Object.keys(byDate).filter(dt => dt >= from && dt < to);
      const amount = dates.reduce((n, dt) => n + byDate[dt], 0), days = nightsBetween(from, to);
      const same = byStop.find(x => x.label === short(l.place));
      if (same) { same.amount += amount; same.days += days; } else byStop.push({ label: short(l.place), amount, days });
    });
    const total = Object.values(byType).reduce((a, b) => a + b, 0);
    return { byType, byStop, total };
  }

  // SVG pie. slices: [{ label, amount, sub }] in fixed categorical order (colour follows the entity: slot i = series i+1).
  function pie(title, slices) {
    const total = slices.reduce((n, x) => n + x.amount, 0) || 1;
    let a0 = -Math.PI / 2;
    const paths = slices.map((x, i) => {
      if (!x.amount) return "";
      const a1 = a0 + 2 * Math.PI * x.amount / total;
      const pt = a => `${(50 + 48 * Math.cos(a)).toFixed(2)} ${(50 + 48 * Math.sin(a)).toFixed(2)}`;
      const d = x.amount >= total ? "M 50 2 A 48 48 0 1 1 49.99 2 Z" : `M 50 50 L ${pt(a0)} A 48 48 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pt(a1)} Z`;
      a0 = a1;
      return `<path d="${d}" class="slice s${i + 1}"><title>${esc(x.label)}: ${money(x.amount)} (${Math.round(100 * x.amount / total)}%)</title></path>`;
    }).join("");
    return `<figure class="pie">
      <figcaption>${esc(title)}</figcaption>
      <svg viewBox="0 0 100 100" role="img" aria-label="${esc(title)} pie chart">${paths}</svg>
      <ul class="legend">${slices.map((x, i) => `<li><span class="swatch s${i + 1}"></span><span class="lg-label">${esc(x.label)}</span><span class="lg-val">${money(x.amount)}${x.sub ? ` <span class="muted">${esc(x.sub)}</span>` : ""}</span></li>`).join("")}</ul>
    </figure>`;
  }

  function costCharts(c) {
    return `<div class="pies">
      ${pie("Cost by type", COST_TYPES.map(([k, l]) => ({ label: l, amount: c.byType[k] })))}
      ${pie("Cost by location", c.byStop.map(x => ({ label: x.label, amount: x.amount, sub: `${x.days}d · ~${money(x.amount / x.days)}/day` })))}
    </div>`;
  }

  // An idea mentioned in the plan: its name, linked to its website if it has one
  function ideaRef(id) {
    const a = ideas[id], name = `<b>${esc(a.title)}</b>`;
    return a.link ? `<a href="${esc(a.link)}" target="_blank" rel="noopener">${name}</a>` : name;
  }

  // Idea cards for one day of the plan (the 📜 day pop-up)
  function dayIdeas({ date, title }) {
    const P = T.plan, ids = [];
    P.legs.forEach(l => (l.days || []).forEach((items, k) => {
      if (addDays(l.daysFrom || l.arrive, k) === date) items.forEach(x => (x.match(idPattern) || []).forEach(id => ids.includes(id) || ids.push(id)));
    }));
    return `<h3 style="margin:4px 4px 8px">📜 ${esc(title)}</h3>${ids.map(id => ideaCard(ideas[id])).join("") || '<p class="muted" style="margin:4px">No idea cards for this day - it\'s free time, travel or work.</p>'}`;
  }

  // "📜 Details" button for any stop/travel card that has an entry in TRIP.details (same keys as plan feedback targets)
  // Small icon link-buttons, same style as 📜 Details
  const mapBtn = (url, label = "📍 Map") => `<a class="details-btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`;
  const webBtn = url => `<a class="details-btn" href="${esc(url)}" target="_blank" rel="noopener">🔗 Website</a>`;

  function detailsBtn(key, label = "📜 Details") {
    const dd = detailsFor(key);
    return `<a class="details-btn" href="${esc(dd?.href || "#details/" + key)}" aria-label="Details">${label}</a>`;
  }

  // Automatic details page for a stop / journey / stay that has no written TRIP.details entry yet
  function autoDetails(key) {
    const [kind, id] = key.split(":");
    const P = T.plan, legIdx = P.legs.findIndex(l => legKey(l) === id), l = P.legs[legIdx], p = l ? place(l.place) : place(id);
    const sec = (title, items) => ({ title, items });
    if (kind === "stay" && l?.stay) {
      const st = l.stay;
      return { title: `🛏️ ${st.name}`, intro: `${p.name} · ${fmt(l.arrive)} → ${fmt(l.leave)} (${nightsBetween(l.arrive, l.leave)} nights)`, sections: [
        sec("Where to stay", [
          { name: st.name, text: [st.covered ? "Paid by Matija's work." : `~${money(st.price)} a night (estimate).`, st.notes].filter(Boolean).join(" ") },
          { name: "📍 Map", link: gmaps(st.name + ", " + p.name) },
          { name: "Compare prices (Google Hotels)", link: `https://www.google.com/travel/hotels?q=${encodeURIComponent(st.name + " " + p.name)}` },
        ]) ] };
    }
    if (kind === "stop" && l) {
      const n = legDayCount(l, legIdx);
      return { title: p.name, intro: `${fmt(l.arrive)} → ${fmt(l.leave)} · ${p.blurb || ""}`, sections: [
        ...(l.stay ? [sec("Where to stay", [{ name: `🛏️ ${l.stay.name}`, text: l.stay.notes || "", link: "#details/stay:" + id }])] : []),
        sec("Day by day", Array.from({ length: n }, (_, k) => ({ name: fmt(addDays(l.daysFrom || l.arrive, k)), text: (l.days?.[k] || []).map(x => x.replace(idPattern, i => ideas[i].title)).join(" · ") || "Free" }))),
        sec("On the map", [{ name: `📍 ${p.name}`, link: gmaps(p.name) }]),
      ] };
    }
    if (kind === "travel" && (id === "home" || l)) {
      const e = planEnds().find(x => visibleTo(x)) || planEnds()[0];
      const to = id === "home" ? null : l?.place, from = id === "home" ? P.legs[lastLegFor(e.who)].place : legIdx > 0 ? P.legs[legIdx - 1].place : null;
      const nm = x => x ? short(x) : (P.home || "Home");
      const text = id === "home" ? planEnds().filter(visibleTo).map(x => x.text).join(" · ") : l?.travel;
      const a = from && place(from), b = to && place(to);
      return { title: `${nm(from)} → ${nm(to)}`, intro: (text || "").replace(idPattern, i => ideas[i].title), sections: [
        ...(a && b ? [sec("Route", [{ name: "📍 Route", link: `https://www.google.com/maps/dir/?api=1&origin=${a.lat},${a.lng}&destination=${b.lat},${b.lng}` }])] : []),
      ] };
    }
    return null;
  }

  function viewDetails(key) {
    const written = detailsFor(key), dd = written || autoDetails(key);
    if (!dd) return `<p><a href="#plan">← Plan</a></p><p class="muted">No details here yet.</p>`;
    return `
      <p style="margin:4px 0"><a href="#plan">← Plan</a></p>
      <h2>${esc(dd.title || key)}</h2>
      ${dd.intro ? `<p class="muted">${esc(dd.intro)}</p>` : ""}
      ${(dd.sections || []).map(sec => `<div class="card"><h3>${esc(sec.title)}</h3>${(sec.items || []).map(it => `
        <div class="item">
          <span class="item-title">${it.link ? `<a href="${esc(it.link)}"${it.link.startsWith("#") ? "" : ' target="_blank" rel="noopener"'}>${esc(it.name)}</a>` : esc(it.name)}</span>
          ${it.text ? `<div class="item-meta">${esc(it.text)}</div>` : ""}
        </div>`).join("")}</div>`).join("")}
      <p class="muted small">${written ? "Prices are estimates - check live rates before booking. " : "This page is put together from the plan. "}Want more here? 💬 Comment on the card in the plan and ask the agent for details.</p>`;
  }

  // Card for a journey between stops (from/to = place ids; null = home). Same 📜 💬 buttons as a stop.
  function travelCard(from, to, date, text, key, owner = {}) {
    const name = id => id ? short(id) : (T.plan.home || "Home");
    const route = `${name(from)} → ${name(to)}`;
    const icon = /✈️/.test(text || "") ? "✈️" : /🚗/.test(text || "") ? "🚗" : "🧳";
    const details = esc((text || "").replace(/^(✈️|🚗)\s*/u, "")).replace(idPattern, ideaRef);
    return `<div class="leg travel-leg">
        <div class="card travel-card${outline(owner)}">
          <div class="item-head"><span class="item-title">${icon} ${esc(route)}</span><span class="tag">${fmt(date)}</span></div>
          ${details ? `<div class="item-meta">${details}</div>` : ""}
          <div class="vote">${detailsBtn(key)}${commentBtn(key, `Travel: ${route}`)}</div>
        </div>
      </div>`;
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
    const pts = T.plan.legs.filter(visibleTo).map(l => place(l.place)).filter((p, i, a) => p.lat && a[i - 1] !== p);
    map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    const latlngs = pts.map(p => [p.lat, p.lng]);
    L.polyline(latlngs, { color: "#c2410c", weight: 3, dashArray: "6 6" }).addTo(map);
    pts.forEach((p, i) => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: "", html: `<div class="pin">${i + 1}</div>`, iconSize: [24, 24], iconAnchor: [12, 12] }),
    }).addTo(map).bindPopup(esc(p.name)));
    map.fitBounds(latlngs, { padding: [30, 30] });
  }

  // Toggle chip shared by the Ideas and Feedback filters. People chips get their blue/pink outline.
  const toggleChip = (group, key, label, on) =>
    `<button class="chip ${on ? "on" : ""} ${PEOPLE.includes(key) || key === AGENT ? tint(key) + "-chip" : ""}" data-${group}="${esc(key)}" aria-pressed="${on}">${label}</button>`;

  // Ideas filters (toggles, same idiom as Comments): 🗓️ Planned / Not planned, and a name = ideas that person has commented on.
  // Both names on = either of you; nothing on = everything.
  function matches(idea) {
    const whoSel = ui.ideaWho || [];
    if (ui.ideaPlanned && !ui.ideaUnplanned && !inPlan.has(idea.id)) return false;
    if (ui.ideaUnplanned && !ui.ideaPlanned && inPlan.has(idea.id)) return false;
    return !whoSel.length || feedback.some(f => f.kind === "idea" && f.idea === idea.id && (whoSel.includes(f.who) || (whoSel.includes(AGENT) && f.resolution)));
  }

  function ideaCard(a) {
    const q = encodeURIComponent(a.title.replace(/\(.*?\)/g, "") + " " + place(a.place).name);
    const notes = feedback.filter(f => f.kind === "idea" && f.idea === a.id && (f.text || ["add", "remove"].includes(f.vote))).sort((x, y) => x.date.localeCompare(y.date));
    const agentNotes = feedback.filter(f => f.kind === "idea" && f.idea === a.id && f.resolution).sort((x, y) => (x.closedAt || x.date).localeCompare(y.closedAt || y.date));
    const reactions = notes.map(f => `<div class="fb ${tint(f.who)}"><b>${esc(f.who)} ${vIcon(f.vote)}</b>${f.vote === "add" ? " Add to plan." : f.vote === "remove" ? " Take out of plan." : ""} ${esc(f.text || "")}</div>`).join("")
      + agentNotes.map(f => `<div class="fb ${tint(AGENT)}"><b>Agent 💬</b> ${esc(f.resolution)}</div>`).join("");
    const state = STATES[place(a.place).name.split(", ").pop()] || "";
    const text = norm([a.title, a.why, place(a.place).name, state, place(a.place).type, a.cat, CATS[a.cat], a.cost, a.dur, inPlan.has(a.id) ? "in plan" : ""].join(" "));
    return `<article class="idea" data-text="${esc(text)}">
      <div class="item-head"><h3>${esc(a.title)}</h3><span class="link-btns">${a.link ? webBtn(a.link) : ""}${detailsFor("idea:" + a.id) ? detailsBtn("idea:" + a.id) : ""}${mapBtn(`https://www.google.com/maps/search/?api=1&query=${q}`)}<button class="icon-btn" data-deleteidea="${a.id}" aria-label="Delete this idea" title="Delete this idea">🗑️</button></span></div>
      <div class="item-meta">📍 ${esc(short(a.place))} · ${CATS[a.cat] || ""} · ${esc(a.dur)} · ${esc(a.cost)}</div>
      <p>${esc(a.why)}</p>
      ${reactions}
      <div class="vote">
        ${inPlan.has(a.id) ? `<button class="on planned-btn" data-removeplan="${a.id}" aria-label="Planned for ${fmt(plannedOn[a.id])} - tap to ask to take it out">🗓️ Planned <span class="tag date-tag">${fmt(plannedOn[a.id])}</span></button>` : `<button data-addplan="${a.id}">🗓️ Add to plan</button>`}
        <button data-ideacomment="${a.id}">💬 Comment</button>
      </div>
    </article>`;
  }

  const isAnswer = f => f.kind === "general" && /^Q: [\s\S]*\nA: /.test(f.text || "");

  // 💬 button for a plan stop, day or journey (mini = icon only, for day rows). Sentiment is picked inside the pop-up.
  function commentBtn(key, title, mini) {
    return `<button data-plancomment="${esc(key)}" data-title="${esc(title)}" aria-label="Comment on ${esc(title)}">💬${mini ? "" : " Comment"}</button>`;
  }

  // Ideas someone has 🗑️ deleted: hidden straight away, until the agent removes the card - unless someone has
  // commented on that delete (= undo), which brings the card back.
  const deletedIdeas = () => new Set(feedback.filter(f => f.kind === "idea" && f.vote === "delete" && f.state === "open"
    && !feedback.some(r => r.kind === "reply" && +r.replyTo === +f.number)).map(f => f.idea));

  function viewIdeas() {
    const deleted = deletedIdeas();
    const regions = [...new Set(T.ideas.map(a => a.place))];
    const inRegion = a => ui.region === "all" || a.place === ui.region || ui.region === "type:" + place(a.place).type;
    const list = T.ideas.filter(a => !deleted.has(a.id) && inRegion(a) && matches(a));
    const groups = regions.map(r => ({ r, items: list.filter(a => a.place === r) })).filter(g => g.items.length);
    return `
      <h2>Ideas</h2>
      <div class="banner info">💡 These cards are suggestions from Claude. Want more, or something specific? Ask on the <a href="#comments">💬 Comments</a> tab (e.g. "ideas for a rainy day in Austin") and the hourly agent will add new cards. 🗓️ Add to plan puts an idea into the plan; 💬 Comment for anything else.</div>
      ${statusBanner()}
      <div class="chips fb-filters" role="group" aria-label="Filter ideas">
        ${PEOPLE.map(p => toggleChip("ideawho", p, esc(p), (ui.ideaWho || []).includes(p))).join("")}
        <span class="chip-sep"></span>
        ${toggleChip("ideaplan", "planned", "🗓️ Planned", !!ui.ideaPlanned)}${toggleChip("ideaplan", "unplanned", "🗓️ Not planned", !!ui.ideaUnplanned)}
      </div>
      <input type="search" id="ideaSearch" placeholder="🔍 Search ideas (e.g. gators, rock, beach)" value="${esc(ui.q || "")}" autocomplete="off" aria-label="Search ideas">
      <select id="region" aria-label="Region"><option value="all">All places</option>${Object.entries(TYPE_ICON).map(([t, icon]) => `<option value="type:${t}" ${ui.region === "type:" + t ? "selected" : ""}>${icon} All ${{ city: "cities", nature: "nature", beach: "beaches" }[t]}</option>`).join("")}<option disabled>──────────</option>${regions.map(r => `<option value="${r}" ${ui.region === r ? "selected" : ""}>${esc(placeLabel(r))}</option>`).join("")}</select>
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

  // Title after the person's name on a comment card: "<icon> RE: <what it's about>" ("<icon>" alone for general comments)
  // "Vegas plan:" etc. for comments on a plan (older comments have no plan id: they were all on the one plan)
  const planName = id => { const p = PLANS.find(x => x.id === id); return p && PLANS.length > 1 ? p.label.replace(/^\S+\s/, "") + ":" : "Plan"; };

  function fbLabel(f) {
    if (f.kind === "idea") return `${vIcon(f.vote)} <b>${f.vote === "add" ? "Add to plan: " : f.vote === "remove" ? "Take out of plan: " : f.vote === "delete" ? "Delete idea: " : "RE: "}${esc(f.ideaTitle || ideas[f.idea]?.title || f.idea)}</b>`;
    if (f.kind === "plan") return `${vIcon(f.vote)} <b>RE: ${esc(planName(f.plan))} ${esc(f.targetTitle || f.target)}</b>`;
    if (f.kind === "reply") return `${vIcon(f.vote)} <b>RE: ${esc(f.replyToWho || "")}'s #${f.replyTo}</b>`;
    if (isAnswer(f)) return `💬 <b>RE: ${esc(f.text.slice(3).split("\nA: ")[0])}</b>`;
    return vIcon(f.vote);
  }
  const fbText = f => isAnswer(f) ? f.text.split("\nA: ").slice(1).join("\nA: ") : f.text;
  const AGENT = "Claude";
  // the Agent filter was removed - drop it from any saved filter state so lists aren't filtered invisibly
  ["ideaWho", "fbWho"].forEach(k => { if (ui[k]) ui[k] = ui[k].filter(w => w !== AGENT); });
  // Agent comment = the note an agent leaves when it closes a comment (its "Resolution"), dated when it was closed.
  const agentComment = f => f.resolution ? { who: AGENT, text: f.resolution, date: f.closedAt || f.date } : null;
  // Thread under a comment: people's replies + the agent's comment, oldest first
  const replyItems = f => feedback.filter(r => r.kind === "reply" && r.replyTo === f.number);
  const thread = f => [...replyItems(f).flatMap(r => [r, agentComment(r)]), agentComment(f)]
    .filter(Boolean).sort((a, b) => a.date.localeCompare(b.date));
  const whoLabel = w => w === AGENT ? "Agent 💬" : esc(w);


  function viewFeedback() {
    // Toggle filters: nothing selected in a group = show all of that group
    const whoSel = ui.fbWho || [];
    const list = feedback
      .filter(f => f.kind !== "reply")
      // a name matches comments that person wrote AND comments they commented on (their replies / the agent's note in the thread)
      .filter(f => (!whoSel.length || [f.who, ...thread(f).map(r => r.who)].some(w => whoSel.includes(w))))
      .sort((a, b) => b.date.localeCompare(a.date));
    // count the cards shown; "pending" = the ⏳ badges visible (cards + replies nested in them)
    const open = list.flatMap(f => [f, ...replyItems(f)]).filter(f => f.state === "open").length;
    return `
      <h2>Comments</h2>
      ${statusBanner()}
      <div class="card composer ${tint(who)}">
        ${who ? `
        <h3>💬 Add comment as ${esc(who)}</h3>
        <p class="muted small" style="margin:0 0 8px">Ask the agent to make a change, e.g. add a specific idea, generate new ideas, change the plan, set a budget…</p>
        <textarea id="freeText" rows="4" placeholder="e.g. Add ideas for a rainy day in Austin. Move the Everglades to the morning."></textarea>
        <div class="row send-row" style="margin-top:8px">
          <select id="freeModel" class="model-select" aria-label="Claude model to action this" title="Claude model to action this">${modelOptions("sonnet")}</select>
          <button class="primary" data-send>Send</button>
        </div>` : `
        <h3>💬 Add comment</h3>
        <p class="muted small" style="margin:0 0 8px">Who are you?</p>
        <div class="row">${PEOPLE.map(p => `<button class="chip ${tint(p)}" data-setwho="${esc(p)}">👤 ${esc(p)}</button>`).join("")}</div>`}
      </div>
      <h2 class="section-title">Comment history</h2>
      <div class="chips fb-filters" role="group" aria-label="Filter comments">
        ${PEOPLE.map(p => toggleChip("fbwho", p, esc(p), whoSel.includes(p))).join("")}
      </div>
      <p class="muted small">${list.length} comment${list.length === 1 ? "" : "s"} · ${open} pending</p>
      ${list.map(f => `
        <div class="card fbitem ${f.state} ${tint(f.who)}">
          <div class="item-head">
            <span><span class="who-name">${esc(f.who)}</span> ${fbLabel(f)}</span>
            ${f.state === "open" ? `<span class="tag over">⏳ pending</span>` : ""}
          </div>
          ${f.text ? `<p>${esc(fbText(f)).replace(/\n/g, "<br>")}</p>` : ""}
          <div class="item-meta">${esc(when(f.date))}${f.model ? ` · 🤖 ${MODEL_NAME[f.model] || esc(f.model)}` : ""}${f.url ? ` · <a href="${esc(f.url)}" target="_blank" rel="noopener">#${f.number}</a>` : ""}</div>
          ${thread(f).map(r => `<div class="reply ${tint(r.who)}">${r.state === "open" ? `<span class="reply-state" title="pending - waiting for the agent">⏳</span>` : ""}<b>${whoLabel(r.who)}${r.who === AGENT ? "" : " " + vIcon(r.vote)}</b> ${esc(r.text)} <span class="muted small">· ${esc(when(r.date))}</span></div>`).join("")}
          ${f.number && f.kind !== "reply" ? `<div class="row end"><button class="reply-btn" data-reply="${f.number}" data-replywho="${esc(f.who)}" data-replytitle="${esc(fbLabel(f).replace(/<[^>]+>/g, ""))}">💬 Comment</button></div>` : ""}
        </div>`).join("") || '<p class="muted">No comments yet.</p>'}
    `;
  }

  const short1 = t => { t = String(t).replace(/\s+/g, " ").trim(); return t.length > 70 ? t.slice(0, 68) + "…" : t; };

  function viewUpdates() {
    const runs = window.RUNS || [];
    const mins = r => Math.max(1, Math.round((new Date(r.end) - new Date(r.start)) / 60000));
    const totalMin = runs.reduce((n, r) => n + mins(r), 0);
    const tokens = runs.reduce((n, r) => n + (r.tokens || 0), 0);
    const cost = runs.reduce((n, r) => n + (r.costUsd || 0), 0);
    const issues = runs.reduce((n, r) => n + (r.issues?.length || 0), 0);
    const time = r => new Date(r.end).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    return `
      <h2>Instructions</h2>
      <div class="card">
        <p style="margin:0 0 8px">Matija & Maryna's plan for CoRL 2026 in Austin. Tell Claude what you think and it updates the plan.</p>
        <ul class="plain">
          <li><b>👤 Pick who you are</b> with the name badge at the top right.</li>
          <li><b>💬 Comment</b> on anything - a stop, a day, a journey, an idea, or in general on the Comments tab - and pick the model to action it: Sonnet (default), Haiku (quick) or Opus (most thorough).</li>
          <li><b>🗓️ Add to plan</b> puts an idea into the plan; tap <b>🗓️ Planned</b> to take it out. <b>🗑️</b> deletes an idea card (undo by commenting on the delete).</li>
          <li><b>📜 Details</b> opens more (maps, hotels, flights, car hire) - ask for it on anything with 💬.</li>
        </ul>
        <p style="margin:8px 0 0">Claude checks for new comments <b>${esc(window.AUTOMATION?.schedule || "")}</b> (Haiku at :00, Sonnet at :20, Opus at :40 past the hour), updates the plan and replies to each comment with what it did - the grey Agent 💬 notes and ✅ on the Comments tab. Every update is listed in the changelog below.</p>
        <div class="stats">
          <div class="stat"><b>${runs.length}</b><span>updates</span></div>
          <div class="stat"><b>${issues}</b><span>comments handled</span></div>
          <div class="stat"><b>${totalMin} min</b><span>total agent time</span></div>
          <div class="stat"><b>${tokens ? Math.round(tokens / 1000) + "k" : "–"}</b><span>tokens${cost ? " · ~$" + cost.toFixed(2) : ""}</span></div>
        </div>
        <p class="muted small" style="margin:8px 0 0">Tokens and cost show only when they can be measured. Runs come out of Matija's Claude subscription, not billed separately.</p>
      </div>
      <h2>Changelog</h2>
      ${runs.map(r => `<div class="card">
        <div class="item-head"><b>${time(r)}</b></div>
        <p style="margin:6px 0">${esc(r.summary)}</p>
        ${(r.issues || []).length ? `<ul class="plain changelog-items">${r.issues.map(n => {
          const f = feedback.find(x => x.number === n);
          // one line per comment: who said what, then what was done (the agent's resolution note)
          const said = f ? `<b>${esc(f.who)}</b> ${fbLabel(f)}${f.text ? `: "${esc(short1(f.text))}"` : ""}` : "comment";
          const done = f?.resolution ? `<div class="muted">→ ${esc(short1(f.resolution))}</div>` : "";
          return `<li><a href="https://github.com/okmatija/corl2026/issues/${n}" target="_blank" rel="noopener">#${n}</a> ${said}${done}</li>`;
        }).join("")}</ul>` : ""}
        <div class="item-meta">${mins(r)} min${r.tokens ? ` · ${Math.round(r.tokens / 1000)}k tokens` : ""}${r.costUsd ? ` · ~$${r.costUsd.toFixed(2)}` : ""}</div>
      </div>`).join("") || '<p class="muted">No updates yet.</p>'}
    `;
  }

  function statusBanner() {
    if (loadState === "off") return '<div class="banner">Comments are not connected yet - sending is disabled.</div>';
    if (loadState === "error") return '<div class="banner">Couldn\'t load the latest comments (showing last saved copy).</div>';
    return "";
  }

  // ---------- dialog ----------
  // Every comment pop-up looks like the Comments tab's box: "<emoji> Add comment as <you>", then what it's about.
  const feedbackDialog = (icon, subject, placeholder) =>
    ask({ title: icon === "add" ? `🗓️ Add to plan as ${who}` : icon === "remove" ? `🗓️ Take out of plan as ${who}` : `${icon} Add comment as ${who}`, body: subject, placeholder, ok: "Send", model: true, as: who });

  // model: show the 🤖 model picker (its value is left in dlgModel for the caller); as: tint the dialog for that person
  function ask({ title, body, placeholder, input, ok = "OK", model, as }) {
    return new Promise(resolve => {
      const dlg = document.getElementById("dlg");
      dlg.className = tint(as);
      document.getElementById("dlgModel").hidden = !model;
      document.getElementById("dlgModel").innerHTML = modelOptions("sonnet");
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
    // Old per-person links (#matija / #maryna) open the Comments tab filtered to that person
    if (person) { ui.fbWho = [person]; store.set("ui", ui); history.replaceState(null, "", "#comments"); return { tab: "comments", render: viewFeedback }; }
    if (tab === "comments" || tab === "feedback") return { tab: "comments", render: viewFeedback };
    if (tab === "ideas") return { tab, render: viewIdeas };
    if (tab === "updates" || tab === "about") return { tab: "about", render: viewUpdates };
    if (tab === "austin") return { tab, render: viewAustin };
    if (tab.startsWith("details/")) return { tab: "details", render: () => viewDetails(tab.slice(8)) };
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
    const ideaDlg = document.getElementById("ideaDlg");
    if (ideaDlg.open && openDay) document.getElementById("ideaDlgBody").innerHTML = dayIdeas(openDay);
    window.scrollTo(0, keepScroll ? y : 0);
    const badge = document.getElementById("whoBtn");
    badge.textContent = who || "Who are you?";
    badge.className = "who-btn " + tint(who);
  }
  const rerender = () => render(true);

  // Plan picker (top left): switching plans re-renders every tab for that plan
  const planSel = document.getElementById("planSel");
  if (planSel) {
    planSel.innerHTML = PLANS.map(p => `<option value="${esc(p.id)}"${p === T.plan ? " selected" : ""}>${esc(p.label || p.name)}</option>`).join("");
    planSel.hidden = PLANS.length < 2;
    planSel.addEventListener("change", () => {
      pickPlan(planSel.value); computePlanned(); store.set("plan", T.plan.id);
      toast(T.plan.label); rerender();
    });
  }

  let toastTimer;
  function toast(msg, ms = 2500) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  document.addEventListener("click", async e => {
    const el = e.target.closest("button");
    if (!el) return;
    const ds = el.dataset;
    if (el.id === "whoBtn") {
      who = PEOPLE[(PEOPLE.indexOf(who) + 1) % PEOPLE.length];
      store.set("who", who); toast("You are " + who); return rerender();
    }
    if (ds.ideawho) {
      const key = "ideaWho", v = ds.ideawho;
      const cur = new Set(ui[key] || []);
      cur.has(v) ? cur.delete(v) : cur.add(v);
      ui[key] = [...cur]; store.set("ui", ui); return rerender();
    }
    if (ds.ideaplan) { const k = ds.ideaplan === "planned" ? "ideaPlanned" : "ideaUnplanned"; ui[k] = !ui[k]; store.set("ui", ui); return rerender(); }
    if (ds.daydetails) {   // 📜 on a day: that day's idea cards, exactly as in the Ideas list
      openDay = { date: ds.daydetails, title: ds.title };
      document.getElementById("ideaDlgBody").innerHTML = dayIdeas(openDay);
      document.getElementById("ideaDlg").showModal();
      return;
    }
    const needWho = () => { if (!who) toast("Tap your name at the top to pick who you are"); return !who; };
    // A comment needs words
    const empty = text => text === null || !text.trim();
    if (ds.addplan) {
      if (needWho()) return;
      const idea = ideas[ds.addplan];
      const text = await feedbackDialog("add", idea.title, "e.g. Any afternoon in Austin works. (optional)");
      if (text === null) return;
      el.disabled = true;
      await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: "add", text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.deleteidea) {   // 🗑️ - sent immediately as a "delete" comment; undo by commenting on it in the Comments tab
      if (needWho()) return;
      const idea = ideas[ds.deleteidea];
      el.disabled = true;
      if (await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: "delete", text: "", model: "sonnet" })) toast("🗑️ Deleted. To undo, 💬 Comment on the delete in the Comments tab.", 6000);
      el.disabled = false;
      return;
    }
    if (ds.removeplan) {
      if (needWho()) return;
      const idea = ideas[ds.removeplan];
      const text = await feedbackDialog("remove", idea.title, "e.g. Not enough time that day. (optional)");
      if (text === null) return;
      el.disabled = true;
      await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: "remove", text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.ideacomment) {
      if (needWho()) return;
      const idea = ideas[ds.ideacomment];
      const text = await feedbackDialog("💬", idea.title, "e.g. Only if it's warm enough.");
      if (empty(text)) return;
      el.disabled = true;
      await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: "note", text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.plancomment) {
      if (needWho()) return;
      const text = await feedbackDialog("💬", ds.title, "e.g. Is one night here enough?");
      if (empty(text)) return;
      el.disabled = true;
      await submit({ who, kind: "plan", target: ds.plancomment, targetTitle: ds.title, vote: "note", text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.answer) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const q = T.openQuestions[+ds.answer];
      const text = (await feedbackDialog("💬", q, "e.g. Yes - and we'd rather…"))?.trim();
      if (!text) return;
      el.disabled = true;
      await submit({ who, kind: "general", text: `Q: ${q}\nA: ${text}`, model: dlgModel });
      el.disabled = false;
    }
    if (ds.reply) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const text = await feedbackDialog("💬", `${ds.replywho}: ${ds.replytitle}`, "e.g. Agreed! Or maybe…");
      if (empty(text)) return;
      el.disabled = true;
      await submit({ who, kind: "reply", replyTo: +ds.reply, replyToWho: ds.replywho, text: text.trim(), model: dlgModel });
      el.disabled = false;
    }
    if (ds.fbwho) {
      const key = "fbWho", v = ds.fbwho;
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
  // remember whether the open questions are folded ("toggle" doesn't bubble, so listen in the capture phase)
  document.addEventListener("toggle", e => {
    if (e.target.id === "openQuestions") { ui.qClosed = !e.target.open; store.set("ui", ui); }
  }, true);
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
