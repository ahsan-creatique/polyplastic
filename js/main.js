/* ============================================================
   Landing page — hero animations + journey path rendering
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Sticky header ---------- */
  const header = document.querySelector(".site-header");
  const onScrollHeader = () => header.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Hero particle field ---------- */
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, particles;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const COUNT = Math.min(90, Math.floor(W / 16));
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + .6,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      a: Math.random() * .5 + .15
    }));

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      // connective lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i], q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(168,85,247,${(1 - d / 130) * .18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      // dots
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.fillStyle = `rgba(196,181,253,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- Typing effect ---------- */
  const typeEl = document.getElementById("typing");
  if (typeEl) {
    const phrases = [
      "From the first customer enquiry…",
      "…through RFQ, costing & approvals…",
      "…development, BOM & NPD execution…",
      "…all the way to the SAP invoice.",
      "One connected journey. Lead to Invoice."
    ];
    let pi = 0, ci = 0, deleting = false;
    const type = () => {
      const phrase = phrases[pi];
      typeEl.textContent = phrase.slice(0, ci);
      if (!deleting && ci < phrase.length) {
        ci++; setTimeout(type, 42);
      } else if (!deleting) {
        deleting = true; setTimeout(type, 1700);
      } else if (ci > 0) {
        ci--; setTimeout(type, 18);
      } else {
        deleting = false; pi = (pi + 1) % phrases.length;
        setTimeout(type, 350);
      }
    };
    setTimeout(type, 1400);
  }

  /* ---------- Render journey path from data ---------- */
  const list = document.getElementById("journeyList");
  if (list && typeof MODULES !== "undefined") {
    const frag = document.createDocumentFragment();

    const startFlag = document.createElement("div");
    startFlag.className = "journey-flag start";
    startFlag.innerHTML = "<span>🏁 Journey Starts — Lead</span>";
    frag.appendChild(startFlag);

    MODULES.forEach(m => {
      const row = document.createElement("div");
      row.className = "module-row";
      row.innerHTML = `
        <div class="module-node">${String(m.id).padStart(2, "0")}</div>
        <article class="module-card" data-href="modules/module-${m.id}.html" role="link" tabindex="0"
                 aria-label="Open Module ${m.id}: ${m.name}">
          <div class="mc-top">
            <div class="mc-ico">${m.icon}</div>
            <div>
              <div class="mc-tag">Module ${String(m.id).padStart(2, "0")} · ${m.submodules ? m.submodules.length + " sub-modules" : m.steps.length + " journey steps"}</div>
              <h3>${m.name}</h3>
            </div>
          </div>
          <p>${m.short}</p>
          <span class="mc-link">Explore this module's journey <span class="arr">→</span></span>
        </article>`;
      frag.appendChild(row);
    });

    const endFlag = document.createElement("div");
    endFlag.className = "journey-flag end";
    endFlag.innerHTML = "<span>🧾 Journey Completes — Invoice</span>";
    frag.appendChild(endFlag);

    list.appendChild(frag);

    // click / keyboard navigation
    list.addEventListener("click", e => {
      const card = e.target.closest(".module-card");
      if (card) window.location.href = card.dataset.href;
    });
    list.addEventListener("keydown", e => {
      const card = e.target.closest(".module-card");
      if (card && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        window.location.href = card.dataset.href;
      }
    });

    /* ---------- Scroll-reveal for module rows ---------- */
    const observer = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          observer.unobserve(en.target);
        }
      });
    }, { threshold: .25 });
    list.querySelectorAll(".module-row").forEach(r => observer.observe(r));

    /* ---------- Progress line fill along path ---------- */
    const fill = document.getElementById("journeyFill");
    const journey = document.getElementById("journey");
    if (fill && journey) {
      const updateFill = () => {
        const rect = journey.getBoundingClientRect();
        const viewMid = window.innerHeight * .55;
        const progress = Math.min(Math.max((viewMid - rect.top) / rect.height, 0), 1);
        fill.style.height = (progress * 100) + "%";
      };
      window.addEventListener("scroll", updateFill, { passive: true });
      updateFill();
    }
  }

  /* ---------- Generic reveal (sections) ---------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = 1;
        en.target.style.transform = "translateY(0)";
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll("[data-reveal]").forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1)";
    revealObs.observe(el);
  });
});
