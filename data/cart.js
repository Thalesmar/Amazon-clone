// we export variable
// and we save the data
export let cart = JSON.parse(localStorage.getItem("cart"));
if (!cart) {
    cart = [
        {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
        },
        {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
        },
    ];
}

// set up localstorage to save data of the cart and checkout
export const handleLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// function to add item to cart
export const addToCartFunc = (productId, selectQuantityValue) => {
    let matchingItem;

    cart.forEach((cartItem) => {
        // If product exists, save it in matchingItem
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    // If product exists, increase quantity
    if (matchingItem) {
        matchingItem.quantity += selectQuantityValue;
    } else {
        // If product does not exist, add it to cart
        cart.push({
            productId: productId,
            quantity: selectQuantityValue,
        });
    }

    handleLocalStorage();
};

//deleting the product
//adding localStorage to save data of checkout page

export const handleRemoveFromCart = (productId) => {
    let newCart = [];

    //loop inside cart
    cart.forEach((cartItem) => {
        // keep only items that are not the one we want to remove
        if (productId !== cartItem.productId) {
            //push cartItem to newCart
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    handleLocalStorage();
};

// function to update the quantity of a specific cart item
export const updateCartItemQuantity = (productId, newQuantity) => {
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity = newQuantity;
        }
    });
    handleLocalStorage();
};

// function to update the cart quantity shown in the header
export const updateCartQuantity = () => {
    const jsCartQuantity = document.querySelector(".js-cart-quantity");
    const returnToHomeLink = document.querySelector(".return-to-home-link");

    // start from 0
    let calcQuantity = 0;

    // loop through cart items and add all quantities together
    cart.forEach((cartItem) => {
        calcQuantity += Number(cartItem.quantity);
    });

    // update only if the element exists on the page
    if (jsCartQuantity) {
        jsCartQuantity.textContent = calcQuantity;
    }

    if (returnToHomeLink) {
        returnToHomeLink.textContent = `${calcQuantity} items`;
    }
};

updateCartQuantity();
