(() => {
  "use strict";
  const ready = () => {
    const body = document.body;
    body.classList.add("motion-ready");

    // Short branded entrance loader.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const loader = document.createElement("div");
      loader.className = "site-loader";
      loader.setAttribute("aria-label", "Loading SHERA_KA_SYSTEM");
      loader.innerHTML = '<div class="loader-core"><div class="loader-emblem"><img src="shera-avatar.webp" alt=""></div><div class="loader-wordmark">SHERA_KA_SYSTEM</div><div class="loader-line"><span></span></div><div class="loader-status">LOADING THE EXPERIENCE</div></div>';
      body.prepend(loader);
      const dismiss = () => {
        loader.classList.add("is-done");
        window.setTimeout(() => loader.remove(), 750);
      };
      window.setTimeout(dismiss, 980);
      window.addEventListener("load", () => window.setTimeout(dismiss, 250), { once: true });
    }

    // Add an accessible mobile menu to pages that share the navigation.
    document.querySelectorAll(".nav").forEach(nav => {
      const links = nav.querySelector(".links");
      if (!links) return;
      let toggle = nav.querySelector(".menu-toggle");
      if (!toggle) {
        toggle = document.createElement("button");
        toggle.className = "menu-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Open menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = "<span></span><span></span>";
        nav.insertBefore(toggle, links);
      }
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        links.classList.toggle("is-open", open);
      });
      links.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }));
    });

    // Reveal sections as they enter the viewport.
    const revealItems = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
      revealItems.forEach(item => observer.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add("is-visible"));
    }

    // Desktop 3D tilt. Touch users keep native swipe and scroll behavior.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll("[data-tilt]").forEach(card => {
        let frame = 0;
        card.addEventListener("pointermove", event => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          const rx = (0.5 - py) * 8;
          const ry = (px - 0.5) * 9;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            card.style.transform = "perspective(1000px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-3px)";
          });
        });
        card.addEventListener("pointerleave", () => {
          cancelAnimationFrame(frame);
          card.style.transform = "";
        });
      });
    }

    // Native touch swipe plus desktop mouse dragging for horizontal decks.
    document.querySelectorAll("[data-swipe-track]").forEach(track => {
      let down = false, startX = 0, startScroll = 0, moved = false;
      track.addEventListener("pointerdown", event => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        down = true; moved = false;
        startX = event.clientX; startScroll = track.scrollLeft;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      });
      track.addEventListener("pointermove", event => {
        if (!down) return;
        const delta = event.clientX - startX;
        if (Math.abs(delta) > 5) moved = true;
        track.scrollLeft = startScroll - delta;
      });
      const stopDrag = () => {
        if (!down) return;
        down = false;
        track.classList.remove("is-dragging");
        if (moved) {
          track.dataset.dragged = "true";
          window.setTimeout(() => delete track.dataset.dragged, 120);
        }
      };
      track.addEventListener("pointerup", stopDrag);
      track.addEventListener("pointercancel", stopDrag);
      track.addEventListener("click", event => {
        if (track.dataset.dragged === "true") {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);
    });

    // Previous/next controls and swipe-deck progress bars.
    document.querySelectorAll("[data-scroll-prev],[data-scroll-next]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-scroll-prev") || button.getAttribute("data-scroll-next");
        const track = document.getElementById(id);
        if (!track) return;
        const first = track.querySelector(":scope > *");
        const step = first ? first.getBoundingClientRect().width + 18 : track.clientWidth * 0.8;
        track.scrollBy({ left: button.hasAttribute("data-scroll-next") ? step : -step, behavior: "smooth" });
      });
    });
    document.querySelectorAll("[data-track-progress]").forEach(fill => {
      const track = document.getElementById(fill.getAttribute("data-track-progress"));
      if (!track) return;
      const update = () => {
        const max = Math.max(1, track.scrollWidth - track.clientWidth);
        const visible = Math.min(100, Math.max(12, (track.clientWidth / track.scrollWidth) * 100));
        const left = (track.scrollLeft / max) * (100 - visible);
        fill.style.width = visible + "%";
        fill.style.transform = "translateX(" + (left / visible * 100) + "%)";
      };
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });

    // Thin reading progress at the top of the viewport.
    const progress = document.querySelector(".scroll-progress");
    if (progress) {
      const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})();