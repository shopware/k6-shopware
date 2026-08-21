import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoProductDetailPage } from "../data.js";
import { getRandomItem } from "../util.js";
import {
  randomString,
  getStoreApiContextToken,
  mergeContextToken,
} from "./utils.js";
import { getAddToCartPayload } from "./payloads/add-to-cart.js";
import { getDeleteCartLineItemPayload } from "./payloads/delete-cart-line-item.js";

export function deleteCartLineItemViaStoreApi(trend, counter) {
  const flowStart = Date.now();
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
  check(contextResp, {
    "Store API context request is successful": (r) => r.status === 200,
  });

  const lineItemId = `k6-line-item-${Date.now()}-${randomString(6)}`;
  const productId = getRandomItem(seoProductDetailPage).id;
  const addToCartPayload = getAddToCartPayload({
    lineItemId,
    productId,
    quantity: 1,
  });

  const addResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item`,
    JSON.stringify(addToCartPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.cart.add_line_item" },
    }
  );
  contextToken = mergeContextToken(contextToken, addResp);
  check(addResp, {
    "Store API add product for delete test is successful": (r) =>
      r.status === 200,
  });

  const deletePayload = getDeleteCartLineItemPayload({ ids: [lineItemId] });
  const resp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item/delete`,
    JSON.stringify(deletePayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.cart.delete_line_item" },
    }
  );
  trend.add(Date.now() - flowStart);
  counter.add(1);

  const success = check(resp, {
    "Store API delete cart line item is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(
      `Store API delete cart line item failed: add=${addResp.status}, delete=${resp.status}, body=${resp.body}`
    );
  }

  return { status: resp.status, productId };
}
