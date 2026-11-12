/* ==========================================================================
   register.js - Registration form validation.
   - Live validation (as the user types) with clear error messages
   - Password-strength indicator and show/hide password buttons
   - Personalised success message (nothing is sent anywhere)
   - SECURITY: input is trimmed and sanitised; the password is never stored,
     logged or displayed; user text is shown with textContent (never innerHTML).
   ========================================================================== */
"use strict";

const MIN_AGE = 18;

/* ---------- Sanitising helpers ---------- */
function cleanText(value) { return value.replace(/\s+/g, " ").trim(); }   // trim + collapse spaces

/* ---------- One validator per field. Each returns "" when valid, or an error message. ---------- */
const validators = {
  fullName(v) {
    v = cleanText(v);
    if (v === "") return "Please enter your full name.";
    if (v.length < 3) return "Your name must be at least 3 characters.";
    if (v.length > 60) return "Your name must be 60 characters or fewer.";
    if (!/^[\p{L}][\p{L} '.-]*$/u.test(v)) return "Use letters only (spaces, apostrophes and hyphens are allowed).";
    if (!v.includes(" ")) return "Please enter your first and last name.";
    return "";
  },
  email(v) {
    v = v.trim();
    if (v === "") return "Please enter your email address.";
    if (v.length > 100) return "Email address is too long.";
    if (!/^[^\s@<>()]+@[^\s@<>()]+\.[A-Za-z]{2,}$/.test(v)) return "Enter a valid email, for example name@example.com.";
    return "";
  },
  mobile(v) {
    v = v.replace(/\s/g, "");
    if (v === "") return "Please enter your mobile number.";
    if (!/^\d+$/.test(v)) return "Use digits only (no +974 or symbols).";
    if (v.length !== 8) return "Qatar mobile numbers have exactly 8 digits.";
    if (!/^[3567]/.test(v)) return "Qatar mobile numbers start with 3, 5, 6 or 7.";
    return "";
  },
  dob(v) {
    if (v === "") return "Please enter your date of birth.";
    const d = new Date(v + "T00:00:00");
    const today = new Date();
    if (isNaN(d.getTime()) || d > today) return "Enter a valid date of birth in the past.";
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    if (age > 110) return "Enter a valid date of birth.";
    if (age < MIN_AGE) return "You must be at least " + MIN_AGE + " years old to register.";
    return "";
  },
  area(v) { return v === "" ? "Please choose your delivery area." : ""; },
  password(v) {
    if (v === "") return "Please create a password.";
    if (v.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-z]/.test(v) || !/[A-Z]/.test(v)) return "Use both uppercase and lowercase letters.";
    if (!/\d/.test(v)) return "Add at least one number.";
    if (!/[^A-Za-z0-9]/.test(v)) return "Add at least one symbol, e.g. ! @ # $ %.";
    return "";
  },
  confirm(v, form) {
    if (v === "") return "Please confirm your password.";
    if (v !== form.elements.password.value) return "Passwords do not match.";
    return "";
  },
  terms(checked) { return checked ? "" : "You must accept the terms and conditions."; }
};

/* ---------- Password strength: score 0-4 ---------- */
function passwordScore(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  if (v.length >= 12 && s >= 3) s = 4;
  return v === "" ? 0 : Math.max(1, Math.min(s, 4));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  if (!form) return;
  const success = document.getElementById("success-box");
  const fields = ["fullName", "email", "mobile", "dob", "area", "password", "confirm", "terms"];

  /* Set the latest allowed birth date (today) so the date picker cannot choose the future */
  const dob = form.elements.dob;
  dob.max = new Date().toISOString().split("T")[0];

  /* Validate one field and show/hide its error message */
  function check(name) {
    const input = form.elements[name];
    const value = input.type === "checkbox" ? input.checked : input.value;
    const message = validators[name](value, form);
    const err = document.getElementById("err-" + name);
    err.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    input.classList.toggle("invalid", message !== "");
    input.classList.toggle("valid", message === "" && value !== "" && value !== false);
    return message === "";
  }

  /* Live validation as the user types / changes a field */
  fields.forEach(name => {
    const input = form.elements[name];
    const evt = (input.type === "checkbox" || input.tagName === "SELECT" || input.type === "date") ? "change" : "input";
    input.addEventListener(evt, () => {
      check(name);
      if (name === "password" && form.elements.confirm.value !== "") check("confirm");
    });
    input.addEventListener("blur", () => check(name));
  });

  /* Password strength meter */
  const meter = document.getElementById("strength-meter");
  const meterText = document.getElementById("strength-text");
  const labels = ["Enter a password", "Weak", "Fair", "Good", "Strong"];
  form.elements.password.addEventListener("input", e => {
    const score = passwordScore(e.target.value);
    meter.className = "strength-meter level-" + score;
    meterText.textContent = "Password strength: " + labels[score];
  });

  /* Show / hide password buttons */
  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", show ? "true" : "false");
    });
  });

  /* Submit: validate everything, then show a personalised message. Nothing is sent. */
  form.addEventListener("submit", e => {
    e.preventDefault();
    let firstBad = null;
    fields.forEach(name => { if (!check(name) && !firstBad) firstBad = form.elements[name]; });
    if (firstBad) { firstBad.focus(); return; }

    const firstName = cleanText(form.elements.fullName.value).split(" ")[0];
    const prefs = Array.from(form.querySelectorAll('input[name="prefs"]:checked')).map(c => c.value);
    document.getElementById("success-name").textContent = "Welcome to Qamar Coffee, " + firstName + "!";
    document.getElementById("success-email").textContent = cleanText(form.elements.email.value);
    document.getElementById("success-area").textContent = form.elements.area.value;
    document.getElementById("success-prefs").textContent = prefs.length ? prefs.join(", ") : "No preference selected - we will surprise you!";

    form.reset();                                   // the password is wiped from the form immediately
    fields.forEach(n => { const i = form.elements[n]; i.classList.remove("valid", "invalid"); i.removeAttribute("aria-invalid"); });
    meter.className = "strength-meter level-0";
    meterText.textContent = "Password strength: Enter a password";
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  document.getElementById("register-again").addEventListener("click", () => {
    success.hidden = true; form.hidden = false; form.elements.fullName.focus();
  });
});
