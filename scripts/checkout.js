// import cart data + function to remove product from cart
import { cart, handleRemoveFromCart } from "../data/cart.js";
// helper function to format price (e.g. cents → dollars)
import { formatCurrency } from "./utils/money.js";

// select the main container where all checkout items will be rendered
const jsOrderSummary = document.querySelector(".js-order-summary");
// var to store all products from products.json
let productsData = [];

// =========================
// 1. FETCH PRODUCTS DATA
// =========================
fetch("./backend/products.json")
    .then((response) => response.json())
    .then((products) => {
        checkoutProductRender(products);
    });

// =========================
// 2. RENDER CHECKOUT PAGE
// =========================
const checkoutProductRender = (products) => {
    let checkoutRenderHtml = ""; // this will store all generated HTML

    // loop through each item in the cart
    cart.forEach((cartItem) => {
        // find the matching product from productsData using productId
        const matchingProduct = products.find((product) => {
            // When you use { } in arrow function → you must return
            return product.id === cartItem.productId;
        });

        // find the matching product from productsData using productId
        if (!matchingProduct) return;

        // build HTML for this cart item
        checkoutRenderHtml += `
            <div class="cart-item-container
                js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                Delivery date: Tuesday, June 21
                </div>

                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingProduct.image}">

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
                    <span class="update-quantity-link link-primary js-update-link"
                        data-product-id = "${matchingProduct.id}">
                        Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link"
                        data-product-id = "${matchingProduct.id}">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    <div class="delivery-option">
                    <input type="radio" checked
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                        Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                        FREE Shipping
                        </div>
                    </div>
                    </div>
                    <div class="delivery-option">
                    <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                        Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                        $4.99 - Shipping
                        </div>
                    </div>
                    </div>
                    <div class="delivery-option">
                    <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                        Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                        $9.99 - Shipping
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>`;
    });
    // after rendering → attach event listeners
    jsOrderSummary.innerHTML = checkoutRenderHtml;
    // after rendering → attach event listeners
    modifyCheckoutItems();
};

// =========================
// 3. HANDLE BUTTON ACTIONS
// =========================
const modifyCheckoutItems = () => {
    // select all delete buttons
    const jsDeleteLink = document.querySelectorAll(".js-delete-link");
    // select all update buttons
    const jsUpdateLink = document.querySelectorAll(".js-update-link");

    // -------- DELETE LOGIC --------
    jsDeleteLink.forEach((link) => {
        link.addEventListener('click', () => {
            // get productId from HTML (data-product-id)
            const productId = link.dataset.productId;
            handleRemoveFromCart(productId);

            const jsCartItemContainer = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            //this remove the div of the product
            jsCartItemContainer.remove();
        })
    });

    // -------- UPDATE LOGIC (not implemented yet) --------
    jsUpdateLink.forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;

        });
    });
};
