(() => {
  "use strict";
  const init = () => {
    const body = document.body;

    // Minimal full-screen chrome wordmark loader.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const loader = document.createElement("div");
      loader.className = "site-loader";
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-label", "Loading SHERA_KA_SYSTEM");
      loader.innerHTML = '<div class="loader-content"><div class="loader-name">SHERA</div><div class="loader-sub">KA SYSTEM</div><div class="loader-progress"><span></span></div></div>';
      body.prepend(loader);
      const hide = () => {
        if (!loader.isConnected) return;
        loader.classList.add("is-hidden");
        window.setTimeout(() => loader.remove(), 650);
      };
      window.setTimeout(hide, 1250);
      window.addEventListener("load", () => window.setTimeout(hide, 300), { once: true });
    }

    // Lightweight ambient particles on the black visual canvas.
    const canvas = document.querySelector(".stage-canvas");
    if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let w = 0, h = 0, raf = 0;
        const particles = [];
        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          w = rect.width; h = rect.height;
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          particles.length = 0;
          const count = Math.min(42, Math.max(18, Math.floor(w * h / 22000)));
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              r: Math.random() * 1.2 + .25,
              vx: (Math.random() - .5) * .12,
              vy: -Math.random() * .16 - .025,
              a: Math.random() * .38 + .08
            });
          }
        };
        const draw = () => {
          ctx.clearRect(0, 0, w, h);
          for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
            if (p.x < -4) p.x = w + 4;
            if (p.x > w + 4) p.x = -4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(228,214,187," + p.a + ")";
            ctx.fill();
          }
          raf = requestAnimationFrame(draw);
        };
        resize();
        draw();
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) cancelAnimationFrame(raf);
          else draw();
        });
      }
    }

    // Simple mobile navigation.
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        nav.classList.toggle("is-open", open);
      });
      nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();