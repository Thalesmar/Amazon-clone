// we export variable
export const cart = [];

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
};
