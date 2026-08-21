/**
 * Default payload for changing customer profile via Store API.
 *
 * Override this file or wrap the function to customise profile data.
 */
export function getChangeProfilePayload({
  salutationId,
  firstName = "K6-Updated",
  lastName = "User-Updated",
}) {
  return {
    salutationId,
    firstName,
    lastName,
  };
}
