// import cart data and the function that adds items to the cart
import { cart, addToCartFunc } from "../data/cart.js";
import { updateCartQuantity } from "../data/cart.js";

// import helper function to convert cents into dollars
import { formatCurrency } from "./utils/money.js";

// get the container where all product cards will be rendered
const jsProductGrid = document.getElementById("jsProductGrid");

// fetch product data from the JSON file
fetch("./backend/products.json")
    .then((response) => response.json())
    .then((data) => {
        // render all product cards on the page
        renderProducts(data);

        // show current total cart quantity in the header
        updateCartQuantity();

        // after rendering HTML, buttons now exist in DOM
        setupAddToCartButtons();
    });

// function to render all product cards
const renderProducts = (data) => {
    // this string will store all product HTML
    let productsHtml = "";

    // loop through each product and generate its HTML
    data.forEach((product) => {
        productsHtml += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-select">
            <option selected value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div class="added-to-cart">✅ Added</div>

        <button class="add-to-cart-button button-primary" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    });

    // insert all generated HTML into the page
    jsProductGrid.innerHTML = productsHtml;
};


// function to show the "Added" message for the clicked product
const showAddedMessage = (button) => {
    // find the "Added" message inside the same product card
    const addedToCart = button
        .closest(".product-container")
        .querySelector(".added-to-cart");

    // show the message
    addedToCart.classList.add("added-to-cart-active");

    // hide the message again after 5 seconds
    setTimeout(() => {
        addedToCart.classList.remove("added-to-cart-active");
    }, 5000);
};

// function to add click events to all Add to Cart buttons
const setupAddToCartButtons = () => {
    // select all Add to Cart buttons after rendering
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

    // loop through each button
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // get product id from the clicked button
            const productId = button.dataset.productId;

            // find the current product card
            const productContainer = button.closest(".product-container");

            // get the quantity select inside this product card
            const select = productContainer.querySelector(
                ".js-quantity-select",
            );

            // convert selected value from string to number
            const selectQuantityValue = Number(select.value);

            // add selected product and quantity to cart
            addToCartFunc(productId, selectQuantityValue);

            // update cart quantity in the header
            updateCartQuantity();

            // show "Added" message
            showAddedMessage(button);
        });
    });
};
