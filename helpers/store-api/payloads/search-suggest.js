/**
 * Default payload for search suggest via Store API.
 *
 * Override this file or wrap the function to customise search criteria.
 */
export function getSearchSuggestPayload({ search }) {
  return { search };
}
