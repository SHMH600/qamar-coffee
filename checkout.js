/* ==========================================================
   checkout.js - Qamar Coffee Roasters

   This file controls the checkout page.

   Main features:
   1. Load products from the shopping cart.
   2. Display product information.
   3. Calculate subtotal.
   4. Apply discount codes.
   5. Calculate delivery fee.
   6. Validate customer information.
   7. Generate a demo order number.
   8. Display order confirmation.
   9. Clear the cart after checkout.

   IMPORTANT:
   This is a demonstration checkout system.
   No real payment or order is processed.
   ========================================================== */

"use strict";


/* ==========================================================
   1. CHECKOUT SETTINGS
   ========================================================== */

/*
   Delivery is free in this demonstration.

   You can change this value later.

   Example:
   const DELIVERY_FEE = 15;
*/

const DELIVERY_FEE = 0;


/* ==========================================================
   2. GET CHECKOUT ELEMENTS
   ========================================================== */

/*
   These variables connect JavaScript
   to the HTML elements in checkout.html.
*/

const checkoutForm = document.getElementById("checkout-form");

const checkoutItems = document.getElementById("checkout-items");

const checkoutSubtotal = document.getElementById("checkout-subtotal");

const checkoutDiscount = document.getElementById("checkout-discount");

const checkoutDelivery = document.getElementById("checkout-delivery");

const checkoutTotal = document.getElementById("checkout-total");

const placeOrderButton = document.getElementById("place-order-btn");

const orderSuccess = document.getElementById("order-success");

const orderNumber = document.getElementById("order-number");


/* ==========================================================
   3. GET CUSTOMER INPUT FIELDS
   ========================================================== */

/*
   These variables store references
   to the customer information fields.
*/

const customerName = document.getElementById("customer-name");

const customerEmail = document.getElementById("customer-email");

const customerPhone = document.getElementById("customer-phone");

const deliveryArea = document.getElementById("delivery-area");

const deliveryAddress = document.getElementById("delivery-address");

const deliveryNotes = document.getElementById("delivery-notes");


/* ==========================================================
   4. GET ERROR MESSAGE ELEMENTS
   ========================================================== */

/*
   Each input has an error message element.

   JavaScript will display an error
   if the entered information is invalid.
*/

const nameError = document.getElementById("name-error");

const emailError = document.getElementById("email-error");

const phoneError = document.getElementById("phone-error");

const areaError = document.getElementById("area-error");

const addressError = document.getElementById("address-error");


/* ==========================================================
   5. FORMAT PRICES
   ========================================================== */

/*
   The original cart.js file already contains
   a function called formatQAR().

   This function uses it to display prices
   in Qatari Riyals.
*/

function checkoutFormatPrice(amount) {

    return formatQAR(amount);

}


/* ==========================================================
   6. GET SELECTED DELIVERY METHOD
   ========================================================== */

/*
   Returns the delivery method selected
   by the customer.

   Possible values:
   - delivery
   - pickup
*/

function getDeliveryMethod() {

    const selected = document.querySelector(
        'input[name="deliveryMethod"]:checked'
    );

    return selected ? selected.value : "delivery";

}


/* ==========================================================
   7. CALCULATE DELIVERY FEE
   ========================================================== */

/*
   Store pickup is always free.

   Home delivery uses the delivery fee
   defined at the beginning of this file.
*/

function calculateDeliveryFee() {

    const method = getDeliveryMethod();

    if (method === "pickup") {

        return 0;

    }

    return DELIVERY_FEE;

}


/* ==========================================================
   8. LOAD VALID CART PRODUCTS
   ========================================================== */

/*
   loadCart() comes from the original cart.js.

   Each cart item contains:
   - id
   - qty

   findProduct() returns the product details
   from the PRODUCTS array.
*/

function getCheckoutProducts() {

    const cart = loadCart();

    const validProducts = [];

    cart.forEach(function(item) {

        const product = findProduct(item.id);

        if (product) {

            validProducts.push({

                product: product,

                quantity: item.qty

            });

        }

    });

    return validProducts;

}


/* ==========================================================
   9. DISPLAY CART PRODUCTS
   ========================================================== */

/*
   This function creates HTML elements
   for every product in the shopping cart.

   The products appear inside the
   Order Summary section.

   textContent is used for product names
   to safely display text.
*/

function renderCheckoutItems() {

    checkoutItems.innerHTML = "";

    const cartProducts = getCheckoutProducts();


    /* Check whether the cart is empty */

    if (cartProducts.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.textContent =
            "Your cart is empty. Please add products before checkout.";

        checkoutItems.appendChild(emptyMessage);

        placeOrderButton.disabled = true;

        return;

    }


    /* Enable the order button */

    placeOrderButton.disabled = false;


    /* Display each product */

    cartProducts.forEach(function(item) {

        const product = item.product;

        const quantity = item.quantity;

        const lineTotal = product.price * quantity;


        /* Main product container */

        const productRow = document.createElement("div");

        productRow.className = "checkout-item";


        /* Product image */

        const productImage = document.createElement("img");

        productImage.src = product.image;

        productImage.alt = product.alt || product.name;


        /* Product information container */

        const productInfo = document.createElement("div");

        productInfo.className = "checkout-item-info";


        /* Product name */

        const productName = document.createElement("h3");

        productName.textContent = product.name;


        /* Product quantity */

        const productQuantity = document.createElement("p");

        productQuantity.textContent = "Quantity: " + quantity;


        /* Add name and quantity */

        productInfo.appendChild(productName);

        productInfo.appendChild(productQuantity);


        /* Product price */

        const productPrice = document.createElement("span");

        productPrice.className = "checkout-item-price";

        productPrice.textContent = checkoutFormatPrice(lineTotal);


        /* Add elements to the product row */

        productRow.appendChild(productImage);

        productRow.appendChild(productInfo);

        productRow.appendChild(productPrice);


        /* Display the product */

        checkoutItems.appendChild(productRow);

    });

}


/* ==========================================================
   10. CALCULATE SUBTOTAL
   ========================================================== */

/*
   Subtotal is calculated by multiplying
   each product price by its quantity.

   Example:
   Coffee price = QAR 50
   Quantity = 2

   Subtotal = QAR 100
*/

function calculateSubtotal() {

    const cartProducts = getCheckoutProducts();

    let subtotal = 0;

    cartProducts.forEach(function(item) {

        subtotal += item.product.price * item.quantity;

    });

    return subtotal;

}


/* ==========================================================
   11. CALCULATE DISCOUNT
   ========================================================== */

/*
   The original website supports:

   QAMAR10   = 10% discount
   WELCOME15 = 15% discount

   getDiscount() returns the discount code.

   DISCOUNT_CODES stores the percentage
   for each valid code.
*/

function calculateDiscount(subtotal) {

    const discountCode = getDiscount();

    if (!discountCode) {

        return 0;

    }

    const discountPercentage = DISCOUNT_CODES[discountCode] || 0;

    const discountAmount =
        subtotal * (discountPercentage / 100);

    return discountAmount;

}


/* ==========================================================
   12. UPDATE ORDER SUMMARY
   ========================================================== */

/*
   This function calculates:

   1. Subtotal
   2. Discount
   3. Delivery fee
   4. Final total

   Formula:

   Total = Subtotal - Discount + Delivery
*/

function updateCheckoutSummary() {

    const subtotal = calculateSubtotal();

    const discount = calculateDiscount(subtotal);

    const delivery = calculateDeliveryFee();

    const total = Math.max(
        0,
        subtotal - discount + delivery
    );


    /* Display subtotal */

    checkoutSubtotal.textContent =
        checkoutFormatPrice(subtotal);


    /* Display discount */

    checkoutDiscount.textContent =
        "- " + checkoutFormatPrice(discount);


    /* Display delivery fee */

    checkoutDelivery.textContent =
        delivery === 0
            ? "FREE"
            : checkoutFormatPrice(delivery);


    /* Display final total */

    checkoutTotal.textContent =
        checkoutFormatPrice(total);

}


/* ==========================================================
   13. SHOW VALIDATION ERRORS
   ========================================================== */

/*
   Displays an error message
   and adds a red border to the field.
*/

function showCheckoutError(input, errorElement, message) {

    errorElement.textContent = message;

    input.classList.add("invalid");

    input.classList.remove("valid");

    input.setAttribute("aria-invalid", "true");

}


/* ==========================================================
   14. CLEAR VALIDATION ERRORS
   ========================================================== */

/*
   Removes the error message
   and changes the input border.
*/

function clearCheckoutError(input, errorElement) {

    errorElement.textContent = "";

    input.classList.remove("invalid");

    input.classList.add("valid");

    input.removeAttribute("aria-invalid");

}


/* ==========================================================
   15. VALIDATE CUSTOMER NAME
   ========================================================== */

/*
   Customer name must contain
   at least two characters.
*/

function validateCustomerName() {

    const name = customerName.value.trim();

    if (name.length < 2) {

        showCheckoutError(
            customerName,
            nameError,
            "Please enter your full name."
        );

        return false;

    }

    clearCheckoutError(customerName, nameError);

    return true;

}


/* ==========================================================
   16. VALIDATE EMAIL ADDRESS
   ========================================================== */

/*
   Checks whether the email address
   has a basic valid email format.
*/

function validateCustomerEmail() {

    const email = customerEmail.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showCheckoutError(
            customerEmail,
            emailError,
            "Please enter a valid email address."
        );

        return false;

    }

    clearCheckoutError(customerEmail, emailError);

    return true;

}


/* ==========================================================
   17. VALIDATE QATAR PHONE NUMBER
   ========================================================== */

/*
   Qatar mobile numbers normally contain
   eight digits.

   Common mobile prefixes:
   3, 5, 6 and 7.

   Example:
   55123456
*/

function validateCustomerPhone() {

    const phone = customerPhone.value.trim();

    const phonePattern = /^[3567][0-9]{7}$/;

    if (!phonePattern.test(phone)) {

        showCheckoutError(
            customerPhone,
            phoneError,
            "Enter a valid 8-digit Qatar mobile number."
        );

        return false;

    }

    clearCheckoutError(customerPhone, phoneError);

    return true;

}


/* ==========================================================
   18. VALIDATE DELIVERY AREA
   ========================================================== */

/*
   Delivery area is required
   only for home delivery.
*/

function validateDeliveryArea() {

    const method = getDeliveryMethod();

    if (method === "pickup") {

        areaError.textContent = "";

        deliveryArea.classList.remove("invalid");

        deliveryArea.removeAttribute("aria-invalid");

        return true;

    }

    if (deliveryArea.value === "") {

        showCheckoutError(
            deliveryArea,
            areaError,
            "Please select your delivery area."
        );

        return false;

    }

    clearCheckoutError(deliveryArea, areaError);

    return true;

}


/* ==========================================================
   19. VALIDATE DELIVERY ADDRESS
   ========================================================== */

/*
   Delivery address is required
   only for home delivery.

   The address must contain
   at least five characters.
*/

function validateDeliveryAddress() {

    const method = getDeliveryMethod();

    if (method === "pickup") {

        addressError.textContent = "";

        deliveryAddress.classList.remove("invalid");

        deliveryAddress.removeAttribute("aria-invalid");

        return true;

    }

    const address = deliveryAddress.value.trim();

    if (address.length < 5) {

        showCheckoutError(
            deliveryAddress,
            addressError,
            "Please enter your complete delivery address."
        );

        return false;

    }

    clearCheckoutError(deliveryAddress, addressError);

    return true;

}


/* ==========================================================
   20. VALIDATE THE COMPLETE FORM
   ========================================================== */

/*
   Calls all validation functions.

   Returns true only when
   every required field is valid.
*/

function validateCheckoutForm() {

    const validName = validateCustomerName();

    const validEmail = validateCustomerEmail();

    const validPhone = validateCustomerPhone();

    const validArea = validateDeliveryArea();

    const validAddress = validateDeliveryAddress();


    return (
        validName &&
        validEmail &&
        validPhone &&
        validArea &&
        validAddress
    );

}


/* ==========================================================
   21. GENERATE DEMO ORDER NUMBER
   ========================================================== */

/*
   Creates a random demonstration order number.

   Example:
   QMR-482731

   This number is not stored on a server.
*/

function generateOrderNumber() {

    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    return "QMR-" + randomNumber;

}


/* ==========================================================
   22. PLACE ORDER
   ========================================================== */

/*
   This function runs when the customer
   clicks the Place Order button.

   Steps:

   1. Prevent the form from reloading.
   2. Check whether the cart is empty.
   3. Validate customer information.
   4. Generate a demo order number.
   5. Clear the shopping cart.
   6. Display the confirmation message.

   IMPORTANT:
   No real order is submitted.
*/

function handleCheckoutSubmit(event) {

    event.preventDefault();


    /* Check whether products exist */

    const cartProducts = getCheckoutProducts();

    if (cartProducts.length === 0) {

        alert("Your cart is empty. Please add products first.");

        return;

    }


    /* Validate customer information */

    const isValid = validateCheckoutForm();

    if (!isValid) {

        /* Focus the first invalid field */

        const firstInvalidField =
            checkoutForm.querySelector(".invalid");

        if (firstInvalidField) {

            firstInvalidField.focus();

        }

        return;

    }


    /* Generate demonstration order number */

    const newOrderNumber = generateOrderNumber();


    /* Display order number */

    orderNumber.textContent = newOrderNumber;


    /* Clear the cart */

    clearCart();


    /* Remove the applied discount code */

    setDiscount("");


    /* Hide checkout form and order summary */

    const checkoutLayout =
        document.querySelector(".checkout-layout");

    checkoutLayout.hidden = true;


    /* Show order confirmation */

    orderSuccess.hidden = false;


    /* Scroll to confirmation */

    orderSuccess.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* ==========================================================
   23. HANDLE DELIVERY METHOD CHANGES
   ========================================================== */

/*
   Updates the checkout summary
   when the customer changes between:

   - Home Delivery
   - Store Pickup

   Delivery address fields are optional
   when store pickup is selected.
*/

function handleDeliveryChange() {

    const method = getDeliveryMethod();

    const isDelivery = method === "delivery";


    /* Update required fields */

    deliveryArea.required = isDelivery;

    deliveryAddress.required = isDelivery;


    /* Clear delivery errors when pickup is selected */

    if (!isDelivery) {

        areaError.textContent = "";

        addressError.textContent = "";

        deliveryArea.classList.remove("invalid");

        deliveryAddress.classList.remove("invalid");

        deliveryArea.removeAttribute("aria-invalid");

        deliveryAddress.removeAttribute("aria-invalid");

    }


    /* Recalculate the total */

    updateCheckoutSummary();

}


/* ==========================================================
   24. INITIALIZE CHECKOUT PAGE
   ========================================================== */

/*
   This function runs after the HTML page loads.

   It performs the following tasks:

   1. Displays cart products.
   2. Calculates the order total.
   3. Connects form validation.
   4. Connects delivery options.
   5. Connects the Place Order button.
*/

function initializeCheckout() {

    /* Stop if checkout elements are missing */

    if (!checkoutForm || !checkoutItems) {

        return;

    }


    /* Display products */

    renderCheckoutItems();


    /* Calculate totals */

    updateCheckoutSummary();


    /* Connect form submission */

    checkoutForm.addEventListener(
        "submit",
        handleCheckoutSubmit
    );


    /* Validate fields when the customer leaves them */

    customerName.addEventListener(
        "blur",
        validateCustomerName
    );

    customerEmail.addEventListener(
        "blur",
        validateCustomerEmail
    );

    customerPhone.addEventListener(
        "blur",
        validateCustomerPhone
    );

    deliveryArea.addEventListener(
        "change",
        validateDeliveryArea
    );

    deliveryAddress.addEventListener(
        "blur",
        validateDeliveryAddress
    );


    /* Listen for delivery method changes */

    const deliveryOptions = document.querySelectorAll(
        'input[name="deliveryMethod"]'
    );

    deliveryOptions.forEach(function(option) {

        option.addEventListener(
            "change",
            handleDeliveryChange
        );

    });


    /* Set initial delivery requirements */

    handleDeliveryChange();

}


/* ==========================================================
   25. START CHECKOUT
   ========================================================== */

/*
   Wait until the HTML document
   has completely loaded.
*/

document.addEventListener(
    "DOMContentLoaded",
    initializeCheckout
);


/* ================= END OF CHECKOUT.JS ================= */