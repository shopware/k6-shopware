/**
 * Default payload for user login via Store API.
 *
 * Override this file or wrap the function to customise login data.
 */
export function getLoginUserPayload({ email, password = "shopware" }) {
  return {
    username: email,
    password,
  };
}
