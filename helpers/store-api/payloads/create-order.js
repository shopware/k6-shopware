/**
 * Default payload for creating an order via Store API.
 *
 * Override this file or wrap the function to customise order data.
 */
export function getCreateOrderPayload() {
  return {
    tos: true,
  };
}
