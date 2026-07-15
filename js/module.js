/* ============================================================
   Module detail pages — renders journey from MODULES data
   Reads: <body data-module="N">
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const id = parseInt(document.body.dataset.module, 10);
  const subId = document.body.dataset.sub ? parseInt(document.body.dataset.sub, 10) : null;
  const mod = MODULES.find(m => m.id === id);
  if (!mod) return;
  const sub = subId && mod.submodules ? mod.submodules.find(s => s.id === subId) : null;

  const pad = n => String(n).padStart(2, "0");
  document.title = sub
    ? `M${pad(id)}.${subId} — ${sub.name} | Creatique × Polyplastic`
    : `Module ${pad(id)} — ${mod.name} | Creatique × Polyplastic`;

  /* ---------- Sticky header ---------- */
  const header = document.querySelector(".site-header");
  const onScrollHeader = () => header.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Reading progress bar ---------- */
  const bar = document.getElementById("readProgress");
  if (bar) {
    const updateBar = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updateBar, { passive: true });
    updateBar();
  }

  /* ---------- Hero ---------- */
  const hero = document.getElementById("moduleHero");
  const crumbMid = sub
    ? `<a href="module-${id}.html">Module ${pad(id)} · ${mod.name}</a><span>/</span><span>Sub-Module ${subId} of ${mod.submodules.length}</span>`
    : `<span>Module ${pad(id)} of ${pad(MODULES.length)}</span>`;
  const heroStats = sub
    ? `<div class="mh-stat"><b>${pad(sub.cycle.length)}</b><small>Cycle Stages</small></div>
       <div class="mh-stat"><b>${pad(new Set(sub.cycle.map(c => c.actor)).size)}</b><small>Actors Involved</small></div>
       <div class="mh-stat"><b>${sub.cycle.some(c => c.branches) ? "Yes" : "—"}</b><small>Approval Gate</small></div>`
    : mod.submodules
    ? `<div class="mh-stat"><b>${pad(mod.submodules.length)}</b><small>Sub-Modules</small></div>
       <div class="mh-stat"><b>${pad(mod.submodules.reduce((n, s) => n + s.cycle.length, 0))}</b><small>Execution Stages</small></div>
       <div class="mh-stat"><b>2nd</b><small>Largest Module</small></div>`
    : `<div class="mh-stat"><b>${pad(mod.steps.length)}</b><small>Journey Steps</small></div>
       <div class="mh-stat"><b>${pad(mod.steps.reduce((n, s) => n + s.features.length, 0))}</b><small>Key Capabilities</small></div>
       <div class="mh-stat"><b>${mod.steps.some(s => s.sap) ? "Yes" : "—"}</b><small>SAP Touchpoint</small></div>`;
  hero.innerHTML = `
    <div class="hero-grid-lines"></div>
    <div class="container mh-inner">
      <div class="mh-crumb">
        <a href="../index.html">← Solution Journey</a>
        <span>/</span>
        ${crumbMid}
      </div>
      <div class="mh-badge-row">
        <div class="mh-num">${sub ? sub.icon : mod.icon}</div>
        <div>
          <div class="mh-kicker">${sub ? `Module ${pad(id)} · Sub-Module ${subId}` : `Module ${pad(id)}`}</div>
          <h1>${sub ? sub.name : mod.name}</h1>
        </div>
      </div>
      <p class="mh-desc">${sub ? sub.short : mod.desc}</p>
      <div class="mh-stats">${heroStats}</div>
    </div>`;

  const wrap = document.getElementById("stepsWrap");

  /* ---------- Sub-module execution cycle (sub pages) ---------- */
  if (sub) {
    const head = document.querySelector(".sec-head-center .sec-title");
    if (head) head.innerHTML = `Execution <span class="grad-text">Cycle</span>`;
    sub.cycle.forEach((c, i) => {
      if (i > 0) {
        const arrow = document.createElement("div");
        arrow.className = "cycle-arrow";
        arrow.innerHTML = "▼";
        wrap.appendChild(arrow);
      }
      const card = document.createElement("div");
      card.className = "cycle-step step-row";
      card.innerHTML = `
        <div class="cycle-num">${pad(i + 1)}</div>
        <div class="cycle-body">
          <div class="cycle-top">
            <span class="cycle-ico">${c.icon}</span>
            <span class="actor-chip">${c.actorIcon || "👤"} ${c.actor}</span>
          </div>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
          ${c.chips ? `<div class="opt-chips">${c.chips.map(o => `<span>${o}</span>`).join("")}</div>` : ""}
          ${c.branches ? `<div class="branch-grid">${c.branches.map(b => `
            <div class="branch ${b.type}">
              <b>${b.type === "ok" ? "✔" : "✖"} ${b.label}</b>
              <span>${b.text}</span>
            </div>`).join("")}</div>` : ""}
        </div>`;
      wrap.appendChild(card);
    });

    const cycObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in-view"); cycObs.unobserve(en.target); }
      });
    }, { threshold: .15 });
    wrap.querySelectorAll(".cycle-step").forEach(r => cycObs.observe(r));

    /* Prev / next sub-module nav */
    const nav = document.getElementById("moduleNav");
    const pSub = mod.submodules.find(s => s.id === subId - 1);
    const nSub = mod.submodules.find(s => s.id === subId + 1);
    nav.innerHTML = `
      <a class="prev ${pSub ? "" : "disabled"}" href="${pSub ? `module-${id}-sub-${pSub.id}.html` : "#"}">
        <span class="nav-label">← Previous Sub-Module</span>
        <span class="nav-title">${pSub ? `${id}.${pSub.id} · ${pSub.name}` : "Start of module"}</span>
      </a>
      <a class="next ${nSub ? "" : "disabled"}" href="${nSub ? `module-${id}-sub-${nSub.id}.html` : "#"}">
        <span class="nav-label">Next Sub-Module →</span>
        <span class="nav-title">${nSub ? `${id}.${nSub.id} · ${nSub.name}` : "End of sub-modules"}</span>
      </a>`;
    return;
  }

  /* ---------- Sub-module grid (module overview page) ---------- */
  if (mod.submodules) {
    const head = document.querySelector(".sec-head-center .sec-title");
    if (head) head.innerHTML = `The <span class="grad-text">${mod.submodules.length} Sub-Modules</span>`;
    const grid = document.createElement("div");
    grid.className = "sub-grid";
    grid.innerHTML = mod.submodules.map(s => `
      <a class="sub-card" href="module-${id}-sub-${s.id}.html">
        <div class="sub-num">${id}.${s.id}</div>
        <div class="sub-ico">${s.icon}</div>
        <h3>${s.name}</h3>
        <p>${s.short}</p>
        <span class="mc-link">View execution cycle <span class="arr">→</span></span>
      </a>`).join("");
    wrap.appendChild(grid);

    const nav = document.getElementById("moduleNav");
    const prevM = MODULES.find(m => m.id === id - 1);
    const nextM = MODULES.find(m => m.id === id + 1);
    nav.innerHTML = `
      <a class="prev ${prevM ? "" : "disabled"}" href="${prevM ? `module-${prevM.id}.html` : "#"}">
        <span class="nav-label">← Previous Module</span>
        <span class="nav-title">${prevM ? `${pad(prevM.id)} · ${prevM.name}` : "Start of journey"}</span>
      </a>
      <a class="next ${nextM ? "" : "disabled"}" href="${nextM ? `module-${nextM.id}.html` : "#"}">
        <span class="nav-label">Next Module →</span>
        <span class="nav-title">${nextM ? `${pad(nextM.id)} · ${nextM.name}` : "End of journey — Invoice"}</span>
      </a>`;
    return;
  }

  /* ---------- Journey steps ---------- */
  mod.steps.forEach((s, i) => {
    if (s.group) {
      const div = document.createElement("div");
      div.className = "step-group";
      div.innerHTML = `<span>${s.group}</span>`;
      wrap.appendChild(div);
    }
    const row = document.createElement("div");
    row.className = "step-row";
    row.innerHTML = `
      <div class="step-node">
        <span class="sn-ico">${s.icon}</span>
        <span class="sn-num">${i + 1}</span>
      </div>
      <div class="step-card">
        <div class="sc-phase">${s.phase}${s.sap ? '<span class="sap-tag">⇄ SAP</span>' : ""}</div>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <ul class="sc-features">${s.features.map(f => `<li>${f}</li>`).join("")}</ul>
        <div class="sc-outcome"><span class="oc-label">Outcome</span>${s.outcome}</div>
      </div>`;
    wrap.appendChild(row);
  });

  const stepObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("in-view");
        stepObs.unobserve(en.target);
      }
    });
  }, { threshold: .15 });
  wrap.querySelectorAll(".step-row").forEach(r => stepObs.observe(r));

  /* ---------- Prev / Next navigation ---------- */
  const nav = document.getElementById("moduleNav");
  const prev = MODULES.find(m => m.id === id - 1);
  const next = MODULES.find(m => m.id === id + 1);
  nav.innerHTML = `
    <a class="prev ${prev ? "" : "disabled"}" href="${prev ? `module-${prev.id}.html` : "#"}">
      <span class="nav-label">← Previous Module</span>
      <span class="nav-title">${prev ? `${pad(prev.id)} · ${prev.name}` : "Start of journey"}</span>
    </a>
    <a class="next ${next ? "" : "disabled"}" href="${next ? `module-${next.id}.html` : "#"}">
      <span class="nav-label">Next Module →</span>
      <span class="nav-title">${next ? `${pad(next.id)} · ${next.name}` : "End of journey — Invoice"}</span>
    </a>`;
});
