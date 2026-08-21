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

export function addUserAddressViaStoreApi(trend, counter) {
  const flowStart = Date.now();
  const email = `k6-address-${Date.now()}-${randomString()}@example.com`;
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "sw-access-key": salesChannel[0].accessKey,
  };
  const withContextHeaders = (contextToken) => {
    if (!contextToken) {
      return baseHeaders;
    }

    return {
      ...baseHeaders,
      "sw-context-token": contextToken,
    };
  };

  const contextResp = http.get(`${salesChannel[0].url}/store-api/context`, {
    headers: baseHeaders,
    tags: {
      name: "api.context.create",
    },
  });
  let contextToken = getStoreApiContextToken(contextResp);

  const contextOk = check(contextResp, {
    "Store API context request for address flow is successful": (r) =>
      r.status === 200,
  });

  const registerPayload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    lastName: "Address",
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
      tags: {
        name: "api.account.register",
      },
    }
  );
  contextToken = mergeContextToken(contextToken, registerResp);

  const registerOk = check(registerResp, {
    "Store API account registration for address flow is successful": (r) =>
      r.status === 200 || r.status === 204,
  });

  const addAddressPayload = getAddAddressPayload({
    salutationId: salesChannel[0].salutationIds[0],
    countryId: salesChannel[0].countryIds[0],
  });

  const addAddressResp = http.post(
    `${salesChannel[0].url}/store-api/account/address`,
    JSON.stringify(addAddressPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: {
        name: "api.account.add_address",
      },
    }
  );

  const addAddressOk = check(addAddressResp, {
    "Store API add address is successful": (r) =>
      r.status === 200 || r.status === 204,
  });

  trend.add(Date.now() - flowStart);
  counter.add(1);

  if (!contextOk || !registerOk || !addAddressOk) {
    console.log(
      `Store API add user address flow failed: context=${contextResp.status}, register=${registerResp.status}, addAddress=${addAddressResp.status}, body=${addAddressResp.body}`
    );
  }

  return { email, status: addAddressResp.status };
}
