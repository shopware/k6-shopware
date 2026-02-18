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
import { getAddToCartPayload } from "./payloads/add-to-cart.js";
import { getCreateOrderPayload } from "./payloads/create-order.js";
import { getListOrdersPayload } from "./payloads/list-orders.js";

export function fetchOrdersViaStoreApi(trend, counter) {
  const flowStart = Date.now();
  const email = `k6-orders-${Date.now()}-${randomString()}@example.com`;
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

  const productId = getRandomItem(seoProductDetailPage).id;
  const addResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item`,
    JSON.stringify(
      getAddToCartPayload({
        lineItemId: `k6-line-item-${Date.now()}-${randomString(6)}`,
        productId,
      })
    ),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.cart.add_line_item" },
    }
  );
  contextToken = mergeContextToken(contextToken, addResp);

  const registerPayload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    email,
    countryId: salesChannel[0].countryIds[0],
    storefrontUrl: salesChannel[0].url,
    guest: true,
  });
  const registerResp = http.post(
    `${salesChannel[0].url}/store-api/account/register`,
    JSON.stringify(registerPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.account.register_guest" },
    }
  );
  contextToken = mergeContextToken(contextToken, registerResp);

  http.post(
    `${salesChannel[0].url}/store-api/checkout/order`,
    JSON.stringify(getCreateOrderPayload()),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.checkout.order" },
    }
  );

  const resp = http.post(
    `${salesChannel[0].url}/store-api/order`,
    JSON.stringify(getListOrdersPayload({ limit: 10 })),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.order.list" },
    }
  );
  trend.add(Date.now() - flowStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch orders is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch orders failed: ${resp.body}`);
  }

  return { status: resp.status };
}
