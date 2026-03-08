import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";
import {
  randomString,
  getStoreApiContextToken,
  mergeContextToken,
} from "./utils.js";
import { getRegisterUserPayload } from "./payloads/register-user.js";
import { getAddAddressPayload } from "./payloads/add-address.js";

export function setDefaultBillingAddressViaStoreApi(trend, counter) {
  const flowStart = Date.now();
  const email = `k6-defbill-${Date.now()}-${randomString()}@example.com`;
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "sw-access-key": salesChannel[0].accessKey,
  };
  const withContextHeaders = (contextToken) =>
    contextToken
      ? { ...baseHeaders, "sw-context-token": contextToken }
      : baseHeaders;

  const contextResp = http.get(`${salesChannel[0].url}/store-api/context`, {
    headers: baseHeaders,
    tags: { name: "api.context.create" },
  });
  let contextToken = getStoreApiContextToken(contextResp);

  const registerPayload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    email,
    countryId: salesChannel[0].countryIds[0],
    storefrontUrl: salesChannel[0].url,
    guest: false,
  });
  const registerResp = http.post(
    `${salesChannel[0].url}/store-api/account/register`,
    JSON.stringify(registerPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.account.register" },
    }
  );
  contextToken = mergeContextToken(contextToken, registerResp);

  const addAddressPayload = getAddAddressPayload({
    salutationId: salesChannel[0].salutationIds[0],
    countryId: salesChannel[0].countryIds[0],
  });
  const addAddressResp = http.post(
    `${salesChannel[0].url}/store-api/account/address`,
    JSON.stringify(addAddressPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.account.add_address" },
    }
  );

  let addressId = null;
  try {
    const body = addAddressResp.json();
    addressId = body?.id || body?.data?.id || null;
  } catch {
    addressId = null;
  }

  if (!addressId) {
    console.log(
      `Store API set default billing address skipped: no addressId returned`
    );
    return { email, addressId: null, status: 0 };
  }

  const resp = http.patch(
    `${salesChannel[0].url}/store-api/account/address/default-billing/${addressId}`,
    null,
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.account.address.default_billing" },
    }
  );
  trend.add(Date.now() - flowStart);
  counter.add(1);

  const success = check(resp, {
    "Store API set default billing address is successful": (r) =>
      r.status === 200 || r.status === 204,
  });

  if (!success) {
    console.log(`Store API set default billing address failed: ${resp.body}`);
  }

  return { email, addressId, status: resp.status };
}
