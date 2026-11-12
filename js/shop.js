/* ==========================================================================
   shop.js - Renders product cards from the PRODUCTS array and adds
   filter, search, sort-by-price, quick-view pop-up and "Add to cart".
   The SAME functions are used by both product pages: the page decides which
   products to show with <main data-shop="coffee"> or data-shop="equipment".
   The home page uses data-featured to show 3 featured products.
   ========================================================================== */
"use strict";

/* ---------- Build one product card (DOM only, no innerHTML) ---------- */
function createProductCard(p) {
  const article = document.createElement("article");
  article.className = "product-card";
  article.dataset.id = p.id;

  const img = document.createElement("img");
  img.src = p.image; img.alt = p.alt; img.width = 400; img.height = 400; img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "product-body";
  const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = p.category;
  const h3 = document.createElement("h3"); h3.textContent = p.name;
  const desc = document.createElement("p"); desc.textContent = p.description;
  const meta = document.createElement("p"); meta.className = "product-meta";
  meta.textContent = p.roast ? p.origin + " · " + p.roast + " roast" : p.origin;
  const price = document.createElement("p"); price.className = "price"; price.textContent = formatQAR(p.price);

  const actions = document.createElement("div"); actions.className = "product-actions";
  const quick = document.createElement("button");
  quick.type = "button"; quick.className = "btn btn-outline btn-small js-quickview"; quick.dataset.id = p.id;
  quick.textContent = "Quick view";
  quick.setAttribute("aria-label", "Quick view: " + p.name);
  const add = document.createElement("button");
  add.type = "button"; add.className = "btn btn-small js-add"; add.dataset.id = p.id;
  add.textContent = "Add to cart";
  add.setAttribute("aria-label", "Add " + p.name + " to cart");
  actions.append(quick, add);

  body.append(tag, h3, desc, meta, price, actions);
  article.append(img, body);
  return article;
}

/* ---------- Render a list of products into a container ---------- */
function renderProducts(list, container) {
  container.textContent = "";
  list.forEach(p => container.appendChild(createProductCard(p)));
}

/* ---------- Filter + search + sort (shared by both product pages) ---------- */
function initShop(pageName) {
  const grid = document.getElementById("product-grid");
  const filters = document.getElementById("category-filters");
  const search = document.getElementById("search-input");
  const sort = document.getElementById("sort-select");
  const count = document.getElementById("result-count");
  const noResults = document.getElementById("no-results");
  const items = PRODUCTS.filter(p => p.page === pageName);
  let activeCategory = "All";

  /* Create the category buttons from the data so they always match the products */
  const categories = ["All"].concat([...new Set(items.map(p => p.category))]);
  categories.forEach(cat => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = cat; b.dataset.category = cat;
    b.setAttribute("aria-pressed", cat === "All" ? "true" : "false");
    filters.appendChild(b);
  });

  function update() {
    const term = search.value.trim().toLowerCase();
    let result = items.filter(p =>
      (activeCategory === "All" || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(term) || p.origin.toLowerCase().includes(term)));
    if (sort.value === "low") result = result.slice().sort((a, b) => a.price - b.price);
    if (sort.value === "high") result = result.slice().sort((a, b) => b.price - a.price);
    if (sort.value === "name") result = result.slice().sort((a, b) => a.name.localeCompare(b.name));
    renderProducts(result, grid);
    count.textContent = "Showing " + result.length + " of " + items.length + " products";
    noResults.hidden = result.length > 0;
  }

  filters.addEventListener("click", e => {
    const b = e.target.closest("button[data-category]");
    if (!b) return;
    activeCategory = b.dataset.category;
    filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    update();
  });
  search.addEventListener("input", update);
  sort.addEventListener("change", update);
  document.getElementById("search-form").addEventListener("submit", e => e.preventDefault());
  update();
}

/* ---------- Quick-view pop-up ---------- */
let lastFocused = null;
function buildModal() {
  const modal = document.createElement("div");
  modal.id = "quickview"; modal.className = "modal"; modal.hidden = true;
  modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "qv-title");
  const box = document.createElement("div"); box.className = "modal-box";
  const close = document.createElement("button");
  close.type = "button"; close.id = "qv-close"; close.className = "icon-btn modal-close"; close.textContent = "✕";
  close.setAttribute("aria-label", "Close quick view");
  const img = document.createElement("img"); img.id = "qv-img"; img.src = "images/logo.svg"; img.width = 400; img.height = 400; img.alt = "";
  const info = document.createElement("div"); info.className = "modal-info";
  const tag = document.createElement("span"); tag.id = "qv-tag"; tag.className = "tag";
  const h2 = document.createElement("h2"); h2.id = "qv-title";
  const desc = document.createElement("p"); desc.id = "qv-desc";
  const det = document.createElement("p"); det.id = "qv-details";
  const price = document.createElement("p"); price.id = "qv-price"; price.className = "price";
  const add = document.createElement("button"); add.type = "button"; add.id = "qv-add"; add.className = "btn"; add.textContent = "Add to cart";
  info.append(tag, h2, desc, det, price, add);
  box.append(close, img, info);
  modal.appendChild(box);
  document.body.appendChild(modal);

  close.addEventListener("click", closeQuickView);
  modal.addEventListener("click", e => { if (e.target === modal) closeQuickView(); });   // click outside the box
  add.addEventListener("click", () => { addToCart(add.dataset.id); add.textContent = "Added ✓"; });
  document.addEventListener("keydown", e => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeQuickView();
    if (e.key === "Tab") {                       // keep keyboard focus inside the pop-up
      const f = modal.querySelectorAll("button");
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
function openQuickView(id) {
  const p = findProduct(id);
  if (!p) return;
  lastFocused = document.activeElement;
  const img = document.getElementById("qv-img"); img.src = p.image; img.alt = p.alt;
  document.getElementById("qv-tag").textContent = p.category;
  document.getElementById("qv-title").textContent = p.name;
  document.getElementById("qv-desc").textContent = p.description;
  document.getElementById("qv-details").textContent = p.details;
  document.getElementById("qv-price").textContent = formatQAR(p.price);
  const add = document.getElementById("qv-add"); add.dataset.id = p.id; add.textContent = "Add to cart";
  document.getElementById("quickview").hidden = false;
  document.getElementById("qv-close").focus();
}
function closeQuickView() {
  document.getElementById("quickview").hidden = true;
  if (lastFocused) lastFocused.focus();
}

/* ---------- Click handling: ONE listener (event delegation) for all cards ---------- */
function initProductClicks() {
  document.addEventListener("click", e => {
    const add = e.target.closest(".js-add");
    if (add) {
      addToCart(add.dataset.id);
      add.textContent = "Added ✓";
      add.classList.add("added");
      setTimeout(() => { add.textContent = "Add to cart"; add.classList.remove("added"); }, 1200);
      return;
    }
    const quick = e.target.closest(".js-quickview");
    if (quick) openQuickView(quick.dataset.id);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildModal();
  initProductClicks();
  const shopPage = document.body.dataset.shop;            // "coffee" or "equipment"
  if (shopPage) initShop(shopPage);
  const featured = document.getElementById("featured-grid");   // home page
  if (featured) renderProducts(PRODUCTS.filter(p => p.featured), featured);
});
