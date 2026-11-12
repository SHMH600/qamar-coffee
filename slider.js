/* ==========================================================================
   slider.js - Home page hero banner: auto-rotating image slider with
   previous / next buttons, dots, pause on hover and keyboard-friendly controls.
   ========================================================================== */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsBox = document.getElementById("slider-dots");
  if (slides.length === 0 || !dotsBox) return;
  let current = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const d = document.createElement("button");
    d.type = "button"; d.className = "dot";
    d.setAttribute("aria-label", "Show slide " + (i + 1));
    d.addEventListener("click", () => { show(i); restart(); });
    dotsBox.appendChild(d);
    return d;
  });

  function show(index) {
    current = (index + slides.length) % slides.length;     // wrap around
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === current);
      s.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }
  function start() { timer = setInterval(() => show(current + 1), 5000); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  document.getElementById("slide-prev").addEventListener("click", () => { show(current - 1); restart(); });
  document.getElementById("slide-next").addEventListener("click", () => { show(current + 1); restart(); });
  const slider = document.getElementById("hero-slider");
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);

  show(0);
  start();
});
