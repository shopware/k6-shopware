/**
 * Default payload for adding a product to the cart via Store API.
 *
 * Override this file or wrap the function to customise cart line-item data.
 */
export function getAddToCartPayload({ lineItemId, productId, quantity = 1 }) {
  return {
    items: [
      {
        id: lineItemId,
        referencedId: productId,
        type: "product",
        quantity,
      },
    ],
  };
}
