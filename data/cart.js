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
}

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
