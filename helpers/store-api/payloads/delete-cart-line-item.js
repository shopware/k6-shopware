/**
 * Default payload for deleting cart line items via Store API.
 *
 * Override this file or wrap the function to customise delete data.
 */
export function getDeleteCartLineItemPayload({ ids }) {
  return { ids };
}
