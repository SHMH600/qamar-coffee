/* ==========================================================================
   cart.js - Shopping cart logic shared by EVERY page.

   Features:
   1. Store shopping cart in localStorage.
   2. Display cart counter in the header.
   3. Add products to the shopping cart.
   4. Increase or decrease product quantities.
   5. Remove products from the cart.
   6. Apply discount codes.
   7. Calculate subtotal, discount and total in QAR.
   8. Display a slide-in shopping cart panel.
   9. Clear the shopping cart.
   10. Proceed to Checkout page (NEW FEATURE).

   IMPORTANT:
   This is a demonstration shopping website.
   No real payment information is collected.
   ========================================================================== */

"use strict";


/* ==========================================================================
   1. LOCAL STORAGE KEYS
   ========================================================================== */

/*
   These keys identify where the shopping cart
   and discount code are stored in the browser.
*/

const CART_KEY = "qamarCart";

const DISCOUNT_KEY = "qamarDiscount";


/* ==========================================================================
   2. STORAGE HELPER FUNCTIONS
   ========================================================================== */

/*
   Load shopping cart data from localStorage.

   The try/catch statement prevents errors
   if browser storage is unavailable.
*/

function loadCart() {

    try {

        const data = JSON.parse(
            localStorage.getItem(CART_KEY)
        );

        return Array.isArray(data)
            ? data.filter(i =>
                i &&
                typeof i.id === "string" &&
                Number.isInteger(i.qty) &&
                i.qty > 0
            )
            : [];

    } catch (e) {

        return [];

    }

}


/*
   Save shopping cart data to localStorage.
*/

function saveCart(cart) {

    try {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    } catch (e) {

        /* Browser storage is unavailable. */

    }

}


/*
   Find a product by its unique ID.

   PRODUCTS is defined in products.js.
*/

function findProduct(id) {

    return PRODUCTS.find(p => p.id === id);

}


/*
   Format a number as Qatari Riyals.

   Example:
   50 -> QAR 50
   50.50 -> QAR 50.50
*/

function formatQAR(n) {

    return "QAR " +
        n.toFixed(2).replace(/\.00$/, "");

}


/* ==========================================================================
   3. SHOPPING CART OPERATIONS
   ========================================================================== */

/*
   Add a product to the shopping cart.

   If the product already exists,
   increase its quantity.

   Maximum quantity per product: 20.
*/

function addToCart(id) {

    if (!findProduct(id)) {

        return;

    }

    const cart = loadCart();

    const line = cart.find(i => i.id === id);

    if (line) {

        line.qty = Math.min(
            line.qty + 1,
            20
        );

    } else {

        cart.push({
            id: id,
            qty: 1
        });

    }

    saveCart(cart);

    updateCartUI();

}


/*
   Increase or decrease product quantity.

   If the quantity reaches zero,
   remove the product from the cart.
*/

function changeQty(id, delta) {

    let cart = loadCart();

    const line = cart.find(i => i.id === id);

    if (!line) {

        return;

    }

    line.qty += delta;

    if (line.qty > 20) {

        line.qty = 20;

    }

    cart = cart.filter(i => i.qty > 0);

    saveCart(cart);

    updateCartUI();

}


/*
   Remove a specific product from the cart.
*/

function removeFromCart(id) {

    saveCart(
        loadCart().filter(i => i.id !== id)
    );

    updateCartUI();

}


/*
   Remove all products from the cart.
*/

function clearCart() {

    saveCart([]);

    updateCartUI();

}


/*
   Calculate the total number of products
   in the shopping cart.
*/

function cartCount() {

    return loadCart().reduce(
        (sum, i) => sum + i.qty,
        0
    );

}


/* ==========================================================================
   4. DISCOUNT CODE FUNCTIONS
   ========================================================================== */

/*
   Get the currently applied discount code.

   DISCOUNT_CODES is defined in products.js.
*/

function getDiscount() {

    try {

        const c = localStorage.getItem(
            DISCOUNT_KEY
        );

        return DISCOUNT_CODES[c] ? c : "";

    } catch (e) {

        return "";

    }

}


/*
   Save the discount code to localStorage.
*/

function setDiscount(code) {

    try {

        localStorage.setItem(
            DISCOUNT_KEY,
            code
        );

    } catch (e) {

        /* Ignore storage errors. */

    }

}


/* ==========================================================================
   5. UPDATE SHOPPING CART USER INTERFACE
   ========================================================================== */

/*
   Update the shopping cart counter
   displayed in the website header.

   Also refresh the shopping cart panel.
*/

function updateCartUI() {

    const counter = document.getElementById(
        "cart-count"
    );

    if (counter) {

        const n = cartCount();

        counter.textContent = n;

        counter.classList.toggle(
            "is-empty",
            n === 0
        );

        counter.classList.remove("bump");

        /* Restart the counter animation. */

        void counter.offsetWidth;

        counter.classList.add("bump");

    }

    renderCartPanel();

}


/* ==========================================================================
   6. DISPLAY SHOPPING CART PRODUCTS
   ========================================================================== */

/*
   Render all products inside the shopping cart panel.

   This function also calculates:
   - Subtotal
   - Discount
   - Final total
*/

function renderCartPanel() {

    const list = document.getElementById(
        "cart-items"
    );

    if (!list) {

        return;

    }

    const cart = loadCart();

    /* Clear existing cart items safely. */

    list.textContent = "";

    const empty = document.getElementById(
        "cart-empty"
    );

    const summary = document.getElementById(
        "cart-summary"
    );

    /*
       Show an empty-cart message when
       no products exist.
    */

    empty.hidden = cart.length > 0;

    summary.hidden = cart.length === 0;


    /* Calculate subtotal. */

    let subtotal = 0;


    cart.forEach(line => {

        const p = findProduct(line.id);

        if (!p) {

            return;

        }

        subtotal += p.price * line.qty;


        /* Create product row. */

        const li = document.createElement("li");

        li.className = "cart-line";


        /* Create product image. */

        const img = document.createElement("img");

        img.src = p.image;

        img.alt = p.alt;

        img.width = 56;

        img.height = 56;


        /* Create product information container. */

        const info = document.createElement("div");

        info.className = "cart-line-info";


        /* Product name. */

        const name = document.createElement("strong");

        name.textContent = p.name;


        /* Product price. */

        const price = document.createElement("span");

        price.textContent =
            formatQAR(p.price) + " each";


        info.append(name, price);


        /* Create quantity controls. */

        const qty = document.createElement("div");

        qty.className = "qty";


        /* Decrease quantity button. */

        const minus = document.createElement("button");

        minus.type = "button";

        minus.textContent = "−";

        minus.setAttribute(
            "aria-label",
            "Decrease quantity of " + p.name
        );

        minus.addEventListener(
            "click",
            () => changeQty(p.id, -1)
        );


        /* Display current quantity. */

        const num = document.createElement("span");

        num.textContent = line.qty;


        /* Increase quantity button. */

        const plus = document.createElement("button");

        plus.type = "button";

        plus.textContent = "+";

        plus.setAttribute(
            "aria-label",
            "Increase quantity of " + p.name
        );

        plus.addEventListener(
            "click",
            () => changeQty(p.id, 1)
        );


        qty.append(minus, num, plus);


        /* Remove product button. */

        const del = document.createElement("button");

        del.type = "button";

        del.className = "icon-btn";

        del.textContent = "✕";

        del.setAttribute(
            "aria-label",
            "Remove " + p.name + " from cart"
        );

        del.addEventListener(
            "click",
            () => removeFromCart(p.id)
        );


        /* Add product elements to the row. */

        li.append(
            img,
            info,
            qty,
            del
        );


        /* Add the product row to the cart. */

        list.appendChild(li);

    });


    /* Calculate discount. */

    const code = getDiscount();

    const pct = code
        ? DISCOUNT_CODES[code]
        : 0;

    const discount = subtotal * pct / 100;


    /* Display subtotal. */

    document.getElementById(
        "cart-subtotal"
    ).textContent = formatQAR(subtotal);


    /* Display discount. */

    document.getElementById(
        "cart-discount"
    ).textContent = pct
        ? "−" + formatQAR(discount) + " (" + code + ")"
        : "None";


    /* Display final total. */

    document.getElementById(
        "cart-total"
    ).textContent = formatQAR(
        subtotal - discount
    );

}


/* ==========================================================================
   7. OPEN SHOPPING CART PANEL
   ========================================================================== */

/*
   Open the slide-in shopping cart panel.
*/

function openCart() {

    const panel = document.getElementById(
        "cart-panel"
    );

    panel.classList.add("open");

    panel.setAttribute(
        "aria-hidden",
        "false"
    );

    document.getElementById(
        "cart-overlay"
    ).classList.add("open");

    document.getElementById(
        "cart-close"
    ).focus();

}


/* ==========================================================================
   8. CLOSE SHOPPING CART PANEL
   ========================================================================== */

/*
   Close the shopping cart panel.
*/

function closeCart() {

    const panel = document.getElementById(
        "cart-panel"
    );

    panel.classList.remove("open");

    panel.setAttribute(
        "aria-hidden",
        "true"
    );

    document.getElementById(
        "cart-overlay"
    ).classList.remove("open");

    const toggle = document.getElementById(
        "cart-toggle"
    );

    if (toggle) {

        toggle.focus();

    }

}


/* ==========================================================================
   9. PROCEED TO CHECKOUT - NEW FEATURE
   ========================================================================== */

/*
   NEW FEATURE:

   This function redirects the customer
   from the shopping cart to checkout.html.

   The cart remains saved in localStorage.

   Therefore, all products and quantities
   will still be available on the checkout page.

   The customer cannot proceed
   if the shopping cart is empty.
*/

function proceedToCheckout() {

    /* Check whether the shopping cart is empty. */

    if (cartCount() === 0) {

        alert(
            "Your cart is empty. Please add products first."
        );

        return;

    }

    /* Navigate to the Checkout page. */

    window.location.href = "checkout.html";

}


/* ==========================================================================
   10. BUILD SHOPPING CART PANEL
   ========================================================================== */

/*
   The shopping cart panel is created using JavaScript.

   This allows every website page
   to share the same shopping cart interface.
*/

function buildCartPanel() {

    /* Prevent creating duplicate cart panels. */

    if (document.getElementById("cart-panel")) {

        return;

    }


    /* Create dark background overlay. */

    const overlay = document.createElement("div");

    overlay.id = "cart-overlay";

    overlay.className = "overlay";


    /* Create shopping cart panel. */

    const panel = document.createElement("aside");

    panel.id = "cart-panel";

    panel.className = "cart-panel";

    panel.setAttribute(
        "aria-label",
        "Shopping cart"
    );

    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    /* Create cart header. */

    const head = document.createElement("div");

    head.className = "cart-head";


    /* Create heading. */

    const h2 = document.createElement("h2");

    h2.textContent = "Your cart";


    /* Create close button. */

    const close = document.createElement("button");

    close.type = "button";

    close.id = "cart-close";

    close.className = "icon-btn";

    close.textContent = "✕";

    close.setAttribute(
        "aria-label",
        "Close cart"
    );


    head.append(h2, close);


    /* Create empty cart message. */

    const empty = document.createElement("p");

    empty.id = "cart-empty";

    empty.textContent =
        "Your cart is empty. Add some coffee!";


    /* Create product list. */

    const list = document.createElement("ul");

    list.id = "cart-items";

    list.className = "cart-items";


    /* Create cart summary. */

    const summary = document.createElement("div");

    summary.id = "cart-summary";

    summary.className = "cart-summary";


    /* Create price summary rows. */

    const rows = [

        ["Subtotal", "cart-subtotal"],

        ["Discount", "cart-discount"],

        ["Total", "cart-total"]

    ];


    rows.forEach(([label, id]) => {

        const row = document.createElement("p");

        row.className = "cart-row";

        const a = document.createElement("span");

        a.textContent = label;

        const b = document.createElement("strong");

        b.id = id;

        row.append(a, b);

        summary.appendChild(row);

    });


    /* ======================================================
       DISCOUNT CODE FORM
       ====================================================== */

    const form = document.createElement("form");

    form.id = "discount-form";

    form.className = "discount-form";

    form.noValidate = true;


    /* Discount label. */

    const lab = document.createElement("label");

    lab.htmlFor = "discount-input";

    lab.textContent = "Discount code";


    /* Discount input. */

    const input = document.createElement("input");

    input.type = "text";

    input.id = "discount-input";

    input.maxLength = 20;

    input.autocomplete = "off";

    input.placeholder = "e.g. QAMAR10";


    /* Apply discount button. */

    const apply = document.createElement("button");

    apply.type = "submit";

    apply.className = "btn btn-small";

    apply.textContent = "Apply";


    form.append(
        lab,
        input,
        apply
    );


    /* Discount message. */

    const msg = document.createElement("p");

    msg.id = "discount-msg";

    msg.className = "form-hint";

    msg.setAttribute(
        "role",
        "status"
    );


    /* Demonstration shop notice. */

    const note = document.createElement("p");

    note.className = "form-hint";

    note.textContent =
        "Demo shop: online payment is not available yet. " +
        "We will contact you to complete your order.";


    /* ======================================================
       CLEAR CART BUTTON
       ====================================================== */

    const clear = document.createElement("button");

    clear.type = "button";

    clear.className = "btn btn-outline btn-small";

    clear.textContent = "Clear cart";

    clear.addEventListener(
        "click",
        clearCart
    );


    /* ======================================================
       PROCEED TO CHECKOUT BUTTON - NEW FEATURE
       ====================================================== */

    /*
       This button is the new addition.

       It appears inside the cart summary,
       below the discount section.

       Clicking the button opens checkout.html.
    */

    const checkoutButton = document.createElement("button");

    checkoutButton.type = "button";

    checkoutButton.id = "proceed-checkout";

    checkoutButton.className = "btn";

    checkoutButton.textContent = "Proceed to Checkout";


    /* Make the checkout button full width. */

    checkoutButton.style.width = "100%";

    checkoutButton.style.marginTop = "15px";

    checkoutButton.style.marginBottom = "10px";


    /* Connect the button to the checkout function. */

    checkoutButton.addEventListener(
        "click",
        proceedToCheckout
    );


    /* ======================================================
       ADD ELEMENTS TO CART SUMMARY
       ====================================================== */

    /*
       The order of elements is:

       1. Discount form
       2. Discount message
       3. Demo shop notice
       4. Proceed to Checkout button (NEW)
       5. Clear cart button
    */

    summary.append(
        form,
        msg,
        note,
        checkoutButton,
        clear
    );


    /* Add all elements to the shopping cart panel. */

    panel.append(
        head,
        empty,
        list,
        summary
    );


    /* Add the overlay and panel to the webpage. */

    document.body.append(
        overlay,
        panel
    );


    /* ======================================================
       CART PANEL EVENT LISTENERS
       ====================================================== */

    /* Close cart when clicking the close button. */

    close.addEventListener(
        "click",
        closeCart
    );


    /* Close cart when clicking outside the panel. */

    overlay.addEventListener(
        "click",
        closeCart
    );


    /* Close cart when pressing Escape. */

    document.addEventListener("keydown", e => {

        if (
            e.key === "Escape" &&
            panel.classList.contains("open")
        ) {

            closeCart();

        }

    });


    /* ======================================================
       DISCOUNT CODE EVENT LISTENER
       ====================================================== */

    /*
       Validate and apply discount codes.

       Valid discount codes are defined
       in products.js.
    */

    form.addEventListener("submit", e => {

        e.preventDefault();


        /* Read and sanitize the discount code. */

        const code = input.value
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");


        /* Check whether the discount code is valid. */

        if (DISCOUNT_CODES[code]) {

            setDiscount(code);

            msg.textContent =
                "Code " + code +
                " applied: " +
                DISCOUNT_CODES[code] +
                "% off.";

        } else {

            setDiscount("");

            msg.textContent =
                "Sorry, that code is not valid.";

        }


        /* Update cart prices after applying discount. */

        renderCartPanel();

    });

}


/* ==========================================================================
   11. INITIALIZE SHOPPING CART
   ========================================================================== */

/*
   Wait until the HTML page has loaded.

   Then:
   1. Build the shopping cart panel.
   2. Connect the cart button.
   3. Update the cart counter and summary.
*/

document.addEventListener("DOMContentLoaded", () => {

    /* Create shopping cart panel. */

    buildCartPanel();


    /* Find the header cart button. */

    const toggle = document.getElementById(
        "cart-toggle"
    );


    /* Open cart when the button is clicked. */

    if (toggle) {

        toggle.addEventListener(
            "click",
            openCart
        );

    }


    /* Display current cart information. */

    updateCartUI();

});


/* ================= END OF CART.JS ================= */