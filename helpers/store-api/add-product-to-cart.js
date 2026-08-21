import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoProductDetailPage } from "../data.js";
import { getRandomItem } from "../util.js";
import { randomString } from "./utils.js";
import { getAddToCartPayload } from "./payloads/add-to-cart.js";

export function addProductToCartViaStoreApi(trend, counter, quantity = 1) {
  const productId = getRandomItem(seoProductDetailPage).id;
  const payload = getAddToCartPayload({
    lineItemId: `k6-line-item-${Date.now()}-${randomString(6)}`,
    productId,
    quantity,
  });

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: {
        name: "api.cart.add_line_item",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API add product to cart is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API add product to cart failed: ${resp.body}`);
  }

  return { productId, status: resp.status };
}
