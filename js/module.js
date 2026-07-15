/* ============================================================
   Module detail pages — renders journey from MODULES data
   Reads: <body data-module="N">
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const id = parseInt(document.body.dataset.module, 10);
  const mod = MODULES.find(m => m.id === id);
  if (!mod) return;

  const pad = n => String(n).padStart(2, "0");
  document.title = `Module ${pad(id)} — ${mod.name} | Creatique × Polyplastic`;

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
  hero.innerHTML = `
    <div class="hero-grid-lines"></div>
    <div class="container mh-inner">
      <div class="mh-crumb">
        <a href="../index.html">← Solution Journey</a>
        <span>/</span>
        <span>Module ${pad(id)} of ${pad(MODULES.length)}</span>
      </div>
      <div class="mh-badge-row">
        <div class="mh-num">${mod.icon}</div>
        <div>
          <div class="mh-kicker">Module ${pad(id)}</div>
          <h1>${mod.name}</h1>
        </div>
      </div>
      <p class="mh-desc">${mod.desc}</p>
      <div class="mh-stats">
        <div class="mh-stat"><b>${pad(mod.steps.length)}</b><small>Journey Steps</small></div>
        <div class="mh-stat"><b>${pad(mod.steps.reduce((n, s) => n + s.features.length, 0))}</b><small>Key Capabilities</small></div>
        <div class="mh-stat"><b>${mod.steps.some(s => s.sap) ? "Yes" : "—"}</b><small>SAP Touchpoint</small></div>
      </div>
    </div>`;

  /* ---------- Journey steps ---------- */
  const wrap = document.getElementById("stepsWrap");
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
