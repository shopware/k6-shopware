/**
 * Default payload for product search via Store API.
 *
 * Override this file or wrap the function to customise search criteria.
 */
export function getSearchProductsPayload({ search }) {
  return { search };
}
