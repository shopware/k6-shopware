/**
 * Default payload for fetching products list via Store API.
 *
 * Override this file or wrap the function to customise list criteria.
 */
export function getFetchProductsPayload({ limit = 25 } = {}) {
  return { limit };
}
