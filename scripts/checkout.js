// import cart data + function to remove product from cart
import {
    cart,
    handleRemoveFromCart,
    updateCartItemQuantity,
} from "../data/cart.js";
import { updateCartQuantity } from "../data/cart.js";

// helper function to format price (e.g. cents → dollars)
import { formatCurrency } from "./utils/money.js";

// select the main container where all checkout items will be rendered
const jsOrderSummary = document.querySelector(".js-order-summary");

// store all products from products.json
let productsData = [];

// =========================
// 1. FETCH PRODUCTS DATA
// =========================
fetch("./backend/products.json")
    .then((response) => response.json())
    .then((products) => {
        // save products so we can re-render later after delete
        productsData = products;

        // render checkout page
        checkoutProductRender(productsData);

        // update cart quantity in header
        updateCartQuantity();
    });

// =========================
// 2. RENDER CHECKOUT PAGE
// =========================
const checkoutProductRender = (products) => {
    let checkoutRenderHtml = "";

    // loop through each item in the cart
    cart.forEach((cartItem) => {
        // find matching product using productId
        const matchingProduct = products.find((product) => {
            return product.id === cartItem.productId;
        });

        // if product was not found, skip it
        if (!matchingProduct) return;

        // build HTML for this cart item
        checkoutRenderHtml += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
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

            <div class="delivery-option">
              <input
                type="radio"
                checked
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
              <input
                type="radio"
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
              <input
                type="radio"
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
      </div>
    `;
    });

    // render all checkout items
    jsOrderSummary.innerHTML = checkoutRenderHtml;

    // after rendering, attach event listeners again
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
        link.addEventListener("click", () => {
            // get productId from HTML (data-product-id)
            const productId = link.dataset.productId;

            // remove product from cart + localStorage
            handleRemoveFromCart(productId);

            // re-render checkout using updated cart
            checkoutProductRender(productsData);

            // update header quantity
            updateCartQuantity();
        });
    });

    // -------- UPDATE LOGIC (not implemented yet) --------
    jsUpdateLink.forEach((link) => {
        // event listener for updateBtn
        link.addEventListener("click", () => {
            // It gets the value from: data-product-id="abc123" in html
            //Because when you click Update, JavaScript must know which product you clicked.
            const productId = link.dataset.productId;

            // 1. document : search inside the whole page and find me the first element that matches this selector and product
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`,
            );

            // 2. Container : It is only that specific product element
            //  and Get quantity label INSIDE this container
            const quantityLabel = container.querySelector(".quantity-label");
            // convert the current quantity string to num so if quantity = '2' = 2
            const quantity = Number(quantityLabel.textContent);

            // 3. Get the whole quantity section (this is what we will replace)
            const quantityContainer =
                container.querySelector(".product-quantity");

            // 4. Create input
            const newInput = document.createElement("input");
            newInput.type = "number"; //type of it
            newInput.value = quantity; // value of it
            newInput.min = "1"; // min num

            // 5. create button
            const newSaveBtn = document.createElement("button");
            const saveBtnNodeText = document.createTextNode("Save");
            newSaveBtn.appendChild(saveBtnNodeText);

            // 6. Clear old content and add new text 'Quantity' before input (we remove the old update and delete and we replace it with new input and btn);
            quantityContainer.innerHTML = "";
            quantityContainer.textContent = "Quantity: ";

            // 7.adding style to input
            newInput.classList.add("quantity-input-style");

            // 8. Add new elements
            quantityContainer.appendChild(newInput);
            quantityContainer.appendChild(newSaveBtn);

            // save button logic
            // saveButton is a single button element, not an array or NodeList.
            // add addEventListener for saveBtn
            newSaveBtn.addEventListener("click", () => {
                // get new quantity value from the newInput value
                const newInputValue = Number(newInput.value);

                //if value not valid
                if (isNaN(newInputValue) || newInputValue < 1) {
                    alert(
                        "Invalid quantity! Please enter a number greater than 0.",
                    );
                    return;
                }

                // ✅ valid case

                setTimeout(() => {
                    alert(`Quantity changed to ${newInputValue}`);
                }, 500);

                // update cart data
                //You gave it 2 values because the function needs 2 pieces of information:
                // which product to update
                //what new quantity to set
                updateCartQuantity(productId, newInputValue);

                // re-render checkout
                //Because when you changed the DOM manually to:
                //to go back to the normal display after saving, like
                checkoutProductRender(productsData);
            });
        });
    });
};
