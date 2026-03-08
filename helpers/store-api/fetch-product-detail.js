import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoProductDetailPage } from "../data.js";
import { getRandomItem } from "../util.js";

export function fetchProductDetailViaStoreApi(trend, counter) {
  const product = getRandomItem(seoProductDetailPage);
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/product/${product.id}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.product.detail" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch product detail is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch product detail failed: ${resp.body}`);
  }

  return { productId: product.id, status: resp.status };
}
