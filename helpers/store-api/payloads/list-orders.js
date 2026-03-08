/**
 * Default payload for listing orders via Store API.
 *
 * Override this file or wrap the function to customise list criteria.
 */
export function getListOrdersPayload({ limit = 10 } = {}) {
  return { limit };
}
