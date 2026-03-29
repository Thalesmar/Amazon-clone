// =========================
// IMPORTS
// =========================

// cart data + functions from cart.js
import {
    cart,
    handleRemoveFromCart,
    updateCartItemQuantity,
} from "../data/cart.js";

// function that updates the cart quantity shown in the header
import { updateCartQuantity } from "../data/cart.js";

// helper function to convert cents into dollars format
import { formatCurrency } from "./utils/money.js";

// dayjs library for dates
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm";

// delivery options data
import { deliveryOptionsId } from "../data/deliveryOptions.js";

// =========================
// MAIN ELEMENT
// =========================

// container where all checkout products will be rendered
const jsOrderSummary = document.querySelector(".js-order-summary");

// =========================
// STORE PRODUCTS DATA
// =========================

// we keep products here after fetch so we can re-render later
let productsData = [];

// =========================
// FETCH PRODUCTS DATA
// =========================

fetch("./backend/products.json")
    .then((response) => response.json())
    .then((products) => {
        // save products globally
        productsData = products;

        // render checkout page
        checkoutProductRender(productsData);

        // update quantity shown in header
        updateCartQuantity();
    });

// =========================
// HELPER: SAVE DELIVERY OPTION
// =========================

// this updates the selected delivery option for one cart item
const updateCartDeliveryOption = (productId, deliveryOptionId) => {
    // find the cart item with this product id
    let matchingItem;

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });

    // update the delivery option id for this cart item
    if (matchingItem) {
        matchingItem.deliveryOptionsId = deliveryOptionId;
    }

    // save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
};

// =========================
// HELPER: GET FORMATTED DATE
// =========================

// this function receives number of delivery days
// then returns a formatted date string like:
// Sunday, March 29
const getFormattedDate = (deliveryDays) => {
    return dayjs().add(deliveryDays, "day").format("dddd, MMMM D");
};

// =========================
// HELPER: GENERATE DELIVERY OPTIONS HTML
// =========================

// this function creates all radio button delivery options
// for one product
const getDeliveryOptionsHTML = (matchingProduct, cartItem) => {
    let html = "";

    // loop through every delivery option
    deliveryOptionsId.forEach((deliveryOption) => {
        // calculate the date for this delivery option
        const deliveryDate = getFormattedDate(deliveryOption.deliveryDays);

        // if shipping price is 0 => show FREE Shipping
        // otherwise show formatted price
        const priceString =
            deliveryOption.priceCents === 0
                ? "FREE Shipping"
                : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

        // check if this delivery option is currently selected for this cart item
        const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

        // build HTML for one delivery option
        html += `
      <div class="delivery-option">
        <input
          type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}"
          ${isChecked ? "checked" : ""}
        >
        <div>
          <div class="delivery-option-date">
            ${deliveryDate}
          </div>
          <div class="delivery-option-price">
            ${priceString}
          </div>
        </div>
      </div>
    `;
    });

    return html;
};

// =========================
// RENDER CHECKOUT PAGE
// =========================

const checkoutProductRender = (products) => {
    let checkoutRenderHtml = "";

    // loop through every cart item
    cart.forEach((cartItem) => {
        // find the matching product data using productId
        const matchingProduct = products.find((product) => {
            return product.id === cartItem.productId;
        });

        // if product not found, skip this item
        if (!matchingProduct) return;

        // find the matching delivery option for this cart item
        const matchingDeliveryOption = deliveryOptionsId.find(
            (deliveryOption) =>
                deliveryOption.id === cartItem.deliveryOptionsId,
        );

        // if not found, use first option as default
        const deliveryOption = matchingDeliveryOption || deliveryOptionsId[0];

        // calculate the top delivery date text
        const deliveryDateText = getFormattedDate(deliveryOption.deliveryDays);

        // build HTML for one cart item
        checkoutRenderHtml += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryDateText}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>

            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>

            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <span
                class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>

              <span
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>

            ${getDeliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
    });

    // put all generated HTML inside the page
    jsOrderSummary.innerHTML = checkoutRenderHtml;

    // after rendering, attach all event listeners again
    modifyCheckoutItems();
};

// =========================
// HANDLE BUTTON ACTIONS
// =========================

const modifyCheckoutItems = () => {
    // select all delete buttons
    const jsDeleteLink = document.querySelectorAll(".js-delete-link");

    // select all update buttons
    const jsUpdateLink = document.querySelectorAll(".js-update-link");

    // select all delivery option radio buttons
    const jsDeliveryOptionInput = document.querySelectorAll(
        ".delivery-option-input",
    );

    // =========================
    // DELETE LOGIC
    // =========================
    jsDeleteLink.forEach((link) => {
        link.addEventListener("click", () => {
            // get product id from clicked button
            const productId = link.dataset.productId;

            // remove from cart
            handleRemoveFromCart(productId);

            // re-render checkout page
            checkoutProductRender(productsData);

            // update header cart quantity
            updateCartQuantity();
        });
    });

    // =========================
    // DELIVERY OPTION RADIO LOGIC
    // =========================
    jsDeliveryOptionInput.forEach((input) => {
        input.addEventListener("change", () => {
            // get product id from data attribute
            const productId = input.dataset.productId;

            // get selected delivery option id
            // convert to number in case your ids are numbers
            const deliveryOptionId = Number(input.dataset.deliveryOptionId);

            // update cart data
            updateCartDeliveryOption(productId, deliveryOptionId);

            // re-render checkout page so date + checked radio update
            checkoutProductRender(productsData);
        });
    });

    // =========================
    // UPDATE QUANTITY LOGIC
    // =========================
    jsUpdateLink.forEach((link) => {
        link.addEventListener("click", () => {
            // get product id of clicked item
            const productId = link.dataset.productId;

            // get the full product container
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`,
            );

            // get current quantity label inside this container
            const quantityLabel = container.querySelector(".quantity-label");

            // convert current quantity text into number
            const quantity = Number(quantityLabel.textContent);

            // get the whole quantity section
            const quantityContainer =
                container.querySelector(".product-quantity");

            // create number input
            const newInput = document.createElement("input");
            newInput.type = "number";
            newInput.value = quantity;
            newInput.min = "1";
            newInput.classList.add("quantity-input-style");

            // create save button
            const newSaveBtn = document.createElement("button");
            newSaveBtn.textContent = "Save";

            // clear old quantity HTML
            quantityContainer.textContent = "Quantity: ";

            // add new input and save button
            quantityContainer.appendChild(newInput);
            quantityContainer.appendChild(newSaveBtn);

            // save new quantity when button clicked
            newSaveBtn.addEventListener("click", () => {
                // get value from input
                const newInputValue = Number(newInput.value);

                // validation
                if (isNaN(newInputValue) || newInputValue < 1) {
                    alert(
                        "Invalid quantity! Please enter a number greater than 0.",
                    );
                    return;
                }

                // update cart quantity in data/localStorage
                updateCartItemQuantity(productId, newInputValue);

                // re-render checkout page
                checkoutProductRender(productsData);

                // update cart quantity in header
                updateCartQuantity();
            });
        });
    });
};
