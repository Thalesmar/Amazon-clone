// 1. Get the product grid container from the DOM
const jsProductGrid = document.getElementById("jsProductGrid");

// 2. Fetch product data from JSON file
fetch("./backend/products.json")
    // 3. Convert response into JavaScript data
    .then((response) => response.json())
    .then((data) => {
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
                    <select class="js-quantity-select" >
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    </select>
                </div>
                <div class="added-to-cart" >✅Added</div>
                <button class="add-to-cart-button button-primary" data-product-id =
                ${product.id} >
                    Add to Cart
                </button>
                </div>
            `;
        });

        // 6. Insert all generated product HTML into the page
        jsProductGrid.innerHTML = productsHtml;

        // 7. Select all Add to Cart buttons after rendering
        const addToCart = document.querySelectorAll(".add-to-cart-button");

        // 8. Add a click event listener to each button
        addToCart.forEach((button) => {
            // 9. Get clicked product id from button dataset
            button.addEventListener("click", () => {
                // 10. Check if clicked product already exists in cart
                const productId = button.dataset.productId;

                //new way to access to DOM
                const select = button
                    // go ins the DOM to find the nearest parent with this class
                    .closest(".product-container")
                    //Now inside that product card find the <select> element
                    .querySelector(".js-quantity-select");

                const selectQuantityValue = Number(select.value);

                let matchingItem;
                cart.forEach((item) => {
                    // 11. If product exists, increase quantity
                    if (productId === item.productId) {
                        matchingItem = item;
                    }
                });
                // 12. If product does not exist, add it to cart
                if (matchingItem) {
                    matchingItem.quantity += selectQuantityValue;
                } else {
                    cart.push({
                        productId: productId,
                        quantity: selectQuantityValue,
                    });
                }

                // 13. Calculate total quantity of all items in cart
                const jsCartQuantity =
                    document.querySelector(".js-cart-quantity");

                let calcQuantity = 0;

                cart.forEach((item) => {
                    calcQuantity += item.quantity;
                });
                // 14. Update cart quantity in the DOM
                jsCartQuantity.innerHTML = calcQuantity; // this edit the quantity and increase it

                //changing the opacity of added-to-cart
                const addedToCart = button
                    .closest(".product-container")
                    .querySelector(".added-to-cart");

                // Show the "Added" message for the clicked product only
                addedToCart.classList.add("added-to-cart-active");

                // Hide it again after 3 seconds
                setTimeout(() => {
                    addedToCart.classList.remove("added-to-cart-active");
                }, 5000);

            });
        });
    });
