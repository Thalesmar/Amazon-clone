const jsProductGrid = document.getElementById("jsProductGrid");

// get data from location or API
fetch('./backend/products.json')
    //convert data into usable JSON
    .then(response => response.json())
    //now we can work with data
    .then(data => {
        //Combining html together
        let productsHTML = "";
        //looping inside the data
        data.forEach((product) => {
            productsHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
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
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}"
          >
            Add to Cart
          </button>
        </div>`;
        });
        jsProductGrid.innerHTML = productsHTML;

        const jsAddToCart = document.querySelectorAll(".js-add-to-cart");
        let cart = [];
        jsAddToCart.forEach((button) => {
            button.addEventListener("click", () => {
                const productId = button.dataset.productId;

                let matchingItem;
                // Loop through the cart to check if this product already exists
                cart.forEach((item) => {
                    // Compare current cart item with the clicked product
                    if (item.productId === productId) {
                        matchingItem = item;
                    }
                });
                // If product is already in the cart → increase its quantity
                if (matchingItem) {
                    matchingItem.quantity++;
                    // If product is not in the cart → add it as a new item
                } else {
                    cart.push({
                        productId: productId,
                        quantity: 1
                    });
                }
                console.log(cart);
            });
        });
    });
