/**
 * Default payload for cancelling an order via Store API.
 *
 * Override this file or wrap the function to customise cancel data.
 */
export function getCancelOrderPayload({ orderId }) {
  return { orderId };
}
