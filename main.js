/* ==========================================================================
   main.js - Features shared by every page:
   mobile menu, "Back to top" button, dark-mode toggle (extra feature),
   live opening-status clock (extra feature) and footer year.
   ========================================================================== */
"use strict";

/* ---------- Dark mode (saved in localStorage) ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.textContent = theme === "dark" ? "☀" : "☾";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}
function initTheme() {
  let theme = "light";
  try { theme = localStorage.getItem("qamarTheme") === "dark" ? "dark" : "light"; } catch (e) { /* ignore */ }
  applyTheme(theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("qamarTheme", next); } catch (e) { /* ignore */ }
  });
}

/* ---------- Mobile navigation ---------- */
function initMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  /* close the menu when a link is chosen */
  nav.addEventListener("click", e => {
    if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => { btn.classList.toggle("visible", window.scrollY > 400); });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Opening hours: live "Open now / Closed" in Qatar time ---------- */
/* Day index follows JavaScript: 0 = Sunday ... 6 = Saturday. Hours are [open, close] in 24h. */
const OPENING_HOURS = { 0: [7, 23], 1: [7, 23], 2: [7, 23], 3: [7, 23], 4: [7, 23], 5: [14, 23], 6: [8, 23] };

function qatarNow() {
  /* Qatar is UTC+3 all year (no daylight saving), so the clock does not depend on the visitor's time zone. */
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Qatar", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type).value;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { day: days.indexOf(get("weekday")), hour: parseInt(get("hour"), 10) % 24, minute: parseInt(get("minute"), 10) };
}
function updateOpenStatus() {
  const el = document.getElementById("open-status");
  if (!el) return;
  const t = qatarNow();
  const [open, close] = OPENING_HOURS[t.day];
  const isOpen = t.hour >= open && t.hour < close;
  const pad = n => String(n).padStart(2, "0");
  el.textContent = (isOpen ? "● Open now" : "● Closed now") + " · Doha " + pad(t.hour) + ":" + pad(t.minute);
  el.classList.toggle("open", isOpen);
  el.classList.toggle("closed", !isOpen);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initBackToTop();
  updateOpenStatus();
  setInterval(updateOpenStatus, 30000);
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
