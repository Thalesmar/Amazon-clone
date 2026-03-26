// import variable
import { cart, addToCartFunc } from "../scripts/cart.js"; // ../ means we go outside the folder 'scripts'

// 1. Get the product grid container from the DOM
const jsProductGrid = document.getElementById("jsProductGrid");

// 2. Fetch product data from JSON file
fetch("./backend/products.json")
    // 3. Convert response into JavaScript data
    .then((response) => response.json())
    .then((data) => {
        //we render all product here
        renderProducts(data);

        // after rendering, buttons now exist in DOM
        setupAddToCartButtons();
    });

// function to render products
const renderProducts = (data) => {
    // 4. Create empty string to store all product HTML
    let productsHtml = "";

    // 5. Loop through each product and build its HTML card
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
          $${(product.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-select">
            <option selected value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div class="added-to-cart">✅Added</div>

        <button class="add-to-cart-button button-primary" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    });

    // 6. Insert all generated product HTML into the page
    jsProductGrid.innerHTML = productsHtml;
};

// function to update cart quantity in DOM
// this code is responsible for changing quantity number from 0 to 1, 2, 3
const updateCartQuantity = () => {
    const jsCartQuantity = document.querySelector(".js-cart-quantity");
    //set cartQuantity start from 0
    let calcQuantity = 0;
    //we loop inside cartItems and add the quantity to cart
    cart.forEach((cartItem) => {
        calcQuantity += cartItem.quantity;
    });

    jsCartQuantity.innerHTML = calcQuantity;
};

// function to show added message
const showAddedMessage = (button) => {
    //new way of DOM
    const addedToCart = button
        .closest(".product-container")
        .querySelector(".added-to-cart");

    // Show the "Added" message for the clicked product only
    addedToCart.classList.add("added-to-cart-active");

    // Hide it again after 5 seconds
    setTimeout(() => {
        addedToCart.classList.remove("added-to-cart-active");
    }, 5000);
};

// function to setup all button events
const setupAddToCartButtons = () => {
    // Select all Add to Cart buttons after rendering
    const addToCart = document.querySelectorAll(".add-to-cart-button");

    // Add a click event listener to each button
    addToCart.forEach((button) => {
        button.addEventListener("click", () => {
            // Get clicked product id from button dataset
            const productId = button.dataset.productId;

            // get the select of this product only
            const productContainer = button.closest(".product-container");
            const select = productContainer.querySelector(".js-quantity-select",);

            //get value from the select and convert to number
            // we already worked with this above in addToCartFunc function
            const selectQuantityValue = Number(select.value);

            // add to cart
            addToCartFunc(productId, selectQuantityValue);

            // update quantity in cart icon
            updateCartQuantity();

            // show added message
            showAddedMessage(button);
        });
    });
};
