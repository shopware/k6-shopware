import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoProductDetailPage } from "../data.js";
import { getRandomItem } from "../util.js";
import {
  randomString,
  getStoreApiContextToken,
  mergeContextToken,
} from "./utils.js";
import { getRegisterUserPayload } from "./payloads/register-user.js";

export function addToWishlistViaStoreApi(trend, counter) {
  const flowStart = Date.now();
  const email = `k6-wish-add-${Date.now()}-${randomString()}@example.com`;
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

  const productId = getRandomItem(seoProductDetailPage).id;
  const resp = http.post(
    `${salesChannel[0].url}/store-api/customer/wishlist/add/${productId}`,
    "{}",
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.customer.wishlist.add" },
    }
  );
  trend.add(Date.now() - flowStart);
  counter.add(1);

  const success = check(resp, {
    "Store API add to wishlist is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API add to wishlist failed: ${resp.body}`);
  }

  return { email, productId, status: resp.status };
}
