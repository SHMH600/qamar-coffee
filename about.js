/* ==========================================================================
   about.js - About page: tabs (Story / Mission / Team) and FAQ accordion.
   ========================================================================== */
"use strict";

/* ---------- Tabs ---------- */
function initTabs() {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  if (tabs.length === 0) return;

  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", e => {            // arrow-key navigation
      let n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { select(n); n.focus(); }
    });
  });
}

/* ---------- FAQ accordion: only one answer open at a time ---------- */
function initAccordion() {
  const buttons = Array.from(document.querySelectorAll(".accordion-btn"));
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      buttons.forEach(b => {
        b.setAttribute("aria-expanded", "false");
        document.getElementById(b.getAttribute("aria-controls")).hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        document.getElementById(btn.getAttribute("aria-controls")).hidden = false;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => { initTabs(); initAccordion(); });
