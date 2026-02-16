/**
 * Default payload for user/guest registration via Store API.
 *
 * Override this file or wrap the function to customise registration data.
 */
export function getRegisterUserPayload({
  salutationId,
  firstName = "K6",
  lastName = "User",
  email,
  password = "shopware",
  guest = false,
  acceptedDataProtection = true,
  street = "Test Strasse 1",
  zipcode = "12345",
  city = "Test City",
  countryId,
  storefrontUrl,
}) {
  return {
    salutationId,
    firstName,
    lastName,
    email,
    password,
    guest,
    acceptedDataProtection,
    billingAddress: {
      street,
      zipcode,
      city,
      countryId,
    },
    storefrontUrl,
  };
}
