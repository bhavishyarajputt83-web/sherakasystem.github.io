(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const init = () => {
    const body = document.body;

    // Brief, minimal logo reveal — no large image or long blocking animation.
    let showLoader = !reduced;
    try {
      if (sessionStorage.getItem("sks-loader-shown")) showLoader = false;
      else sessionStorage.setItem("sks-loader-shown", "1");
    } catch (_) { /* Storage may be unavailable; the short loader remains optional. */ }
    if (showLoader) {
      const loader = document.createElement("div");
      loader.className = "site-loader";
      loader.innerHTML = '<div class="loader-inner"><div class="loader-metal">SHERA</div><div class="loader-small">KA&nbsp; / &nbsp;SYSTEM</div><div class="loader-bar"><span></span></div></div>';
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-label", "Loading SHERA_KA_SYSTEM");
      body.prepend(loader);
      const remove = () => {
        if (!loader.isConnected) return;
        loader.classList.add("loader-out");
        window.setTimeout(() => loader.remove(), 520);
      };
      window.setTimeout(remove, 820);
      window.addEventListener("load", () => window.setTimeout(remove, 160), { once: true });
    }

    // Mobile navigation.
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        nav.classList.toggle("is-open", open);
      });
      nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
      document.addEventListener("click", event => {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Scroll reveals.
    const reveal = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
      reveal.forEach(item => observer.observe(item));
    } else reveal.forEach(item => item.classList.add("revealed"));

    // Scroll progress.
    const progress = document.querySelector(".scroll-progress");
    if (progress) {
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + "%";
      };
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    }

    // Ambient particles on the cinematic hero, with low particle count for performance.
    const canvas = document.querySelector(".hero-particles");
    if (canvas && !reduced) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let width = 0, height = 0, raf = 0;
        const points = [];
        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
          width = rect.width; height = rect.height;
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          points.length = 0;
          const count = Math.min(70, Math.max(26, Math.floor(width * height / 11500)));
          for (let i = 0; i < count; i++) {
            points.push({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.1,r:Math.random()*1.25+.25,a:Math.random()*.38+.08});
          }
        };
        const draw = () => {
          ctx.clearRect(0,0,width,height);
          for (let i=0;i<points.length;i++) {
            const p=points[i];
            p.x+=p.vx;p.y+=p.vy;
            if(p.x<-3)p.x=width+3;if(p.x>width+3)p.x=-3;
            if(p.y<-3)p.y=height+3;if(p.y>height+3)p.y=-3;
            ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(222,219,211,"+p.a+")";ctx.fill();
            for(let j=i+1;j<points.length;j++){
              const q=points[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
              if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle="rgba(207,197,177,"+((1-d/105)*.095)+")";ctx.lineWidth=.5;ctx.stroke();}
            }
          }
          raf=requestAnimationFrame(draw);
        };
        resize();draw();
        window.addEventListener("resize",resize);
        document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else draw();});
      }
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();