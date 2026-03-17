/**
 * Default payload for adding a customer address via Store API.
 *
 * Override this file or wrap the function to customise address data.
 */
export function getAddAddressPayload({
  salutationId,
  firstName = "K6",
  lastName = "Address2",
  street = "Address Strasse 12",
  zipcode = "54321",
  city = "Address City",
  countryId,
  phoneNumber = "123456789",
}) {
  return {
    salutationId,
    firstName,
    lastName,
    street,
    zipcode,
    city,
    countryId,
    phoneNumber,
  };
}
