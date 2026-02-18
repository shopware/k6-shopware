/**
 * Default payload for handling order payment via Store API.
 *
 * Override this file or wrap the function to customise payment redirect URLs.
 */
export function getHandleOrderPaymentPayload({ orderId, finishUrl, errorUrl }) {
  return {
    orderId,
    finishUrl,
    errorUrl,
  };
}
