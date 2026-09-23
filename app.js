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
  const vIcon = v => v === "up" ? "👍" : "👎";

  // Latest vote per person per idea
  function votes(ideaId) {
    const out = {};
    feedback.filter(f => f.kind === "idea" && f.idea === ideaId)
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
        const obl = T.obligations.filter(o => date >= o.start && date <= o.end).map(o => `<span class="oblig">${esc(o.title)}</span>`);
        const items = (l.days?.[k] || []).map(s => esc(s).replace(idPattern, id => `<b>${esc(ideas[id].title)}</b>`));
        const lines = [...obl, ...items];
        return `<div class="day"><div class="date"><b>${fmt(date, { weekday: "short" })}</b>${fmt(date, { day: "numeric", month: "short" })}</div><ul>${lines.map(x => `<li>${x}</li>`).join("") || "<li class='muted'>Free</li>"}</ul></div>`;
      }).join("");
      const s = l.stay;
      return `
        <div class="leg">
          <div class="dot">${i + 1}</div>
          <div class="travel">${esc(l.travel || "")}</div>
          <div class="card">
            <div class="item-head"><h3>${esc(p.name)}</h3><span class="tag">${n} night${n > 1 ? "s" : ""}</span></div>
            <div class="item-meta">${fmt(l.arrive)} → ${fmt(l.leave)} · ${esc(p.blurb || "")}</div>
            ${s ? `<div class="stay"><div class="item-head"><span>🛏️ ${esc(s.name)}</span><span class="tag ${s.price <= P.budgetPerNight ? "ok" : "over"}">~${money(s.price)}/nt</span></div>${s.notes ? `<div class="item-meta">${esc(s.notes)}</div>` : ""}</div>` : ""}
            <div class="days">${days}</div>
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
          <div class="stat"><b>${money(lodging)}</b><span>lodging est. · budget ${money(P.budgetPerNight)}/nt</span></div>
        </div>
      </div>
      <div class="banner">${esc(T.meta.status)} Updated ${esc(T.meta.updated)}.</div>
      ${T.openQuestions?.length ? `<div class="card"><h3>Open questions</h3><ul class="plain">${T.openQuestions.map(q => `<li>${esc(q)}</li>`).join("")}</ul><p class="muted small" style="margin:6px 0 0">Answer on your own tab: ${PEOPLE.map(p => `<a href="#${p.toLowerCase()}">${esc(p)}</a>`).join(" · ")}</p></div>` : ""}
      <div id="map" role="img" aria-label="Route map"></div>
      ${legs}
      <div class="leg"><div class="dot">✓</div><div class="travel">🏁 ${fmt(end.date)} · ${esc(end.text)}</div></div>
    `;
  }

  function drawMap() {
    if (map) { map.remove(); map = null; }
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
    const reactions = PEOPLE.filter(p => v[p]).map(p => `
      <div class="fb ${v[p].vote}"><b>${esc(p)} ${vIcon(v[p].vote)}</b>${v[p].text ? ` ${esc(v[p].text)}` : ""}</div>`).join("");
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

  function viewIdeas() {
    const regions = [...new Set(T.ideas.map(a => a.place))];
    const list = T.ideas.filter(a => (ui.region === "all" || a.place === ui.region) && matches(a));
    const groups = regions.map(r => ({ r, items: list.filter(a => a.place === r) })).filter(g => g.items.length);
    return `
      <h2>Ideas</h2>
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
        <div class="row end" style="margin-top:8px"><button class="primary" data-send="${esc(name)}">Send as ${esc(name)}</button></div>
      </div>
      <p class="muted small">${mine.length} item${mine.length === 1 ? "" : "s"} · ${open} waiting for Claude · ${mine.length - open} done</p>
      ${mine.map(f => `
        <div class="card fbitem ${f.state}">
          <div class="item-head">
            <span>${f.kind === "idea" ? `${vIcon(f.vote)} <b>${esc(f.ideaTitle || ideas[f.idea]?.title || f.idea)}</b>` : "💬 <b>General</b>"}</span>
            <span class="tag ${f.state === "open" ? "over" : "ok"}">${f.state === "open" ? "⏳ open" : "✅ done"}</span>
          </div>
          ${f.text ? `<p>${esc(f.text).replace(/\n/g, "<br>")}</p>` : ""}
          ${f.resolution ? `<p class="resolution">🤖 ${esc(f.resolution)}</p>` : ""}
          <div class="item-meta">${fmt(f.date.slice(0, 10))}${f.url ? ` · <a href="${esc(f.url)}" target="_blank" rel="noopener">#${f.number}</a>` : ""}</div>
        </div>`).join("") || '<p class="muted">No feedback yet.</p>'}
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
    return person ? { tab, render: () => viewPerson(person) } : tab === "ideas" ? { tab, render: viewIdeas } : { tab: "plan", render: viewPlan };
  }

  function render(keepScroll) {
    const y = window.scrollY;
    const r = route();
    // keep a half-typed free-text note across re-renders
    const draft = document.getElementById("freeText")?.value;
    document.getElementById("view").innerHTML = r.render();
    if (draft && document.getElementById("freeText")) document.getElementById("freeText").value = draft;
    document.querySelectorAll(".tabs a").forEach(a => a.classList.toggle("active", a.dataset.tab === r.tab));
    if (r.tab === "plan") drawMap(); else if (map) { map.remove(); map = null; }
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
    if (ds.vote) {
      if (!who) { toast("Tap 👤 at the top to pick who you are"); return; }
      const idea = ideas[ds.idea];
      const text = await ask({ title: `${vIcon(ds.vote)} ${idea.title}`, body: `Voting as ${who}. Reason (optional):`, placeholder: ds.vote === "up" ? "Why do you like it?" : "Why not?", ok: "Send" });
      if (text === null) return;
      el.disabled = true;
      await submit({ who, kind: "idea", idea: idea.id, ideaTitle: idea.title, vote: ds.vote, text: text.trim() });
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
