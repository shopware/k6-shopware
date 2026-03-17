import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoListingPage } from "../data.js";
import { getRandomItem } from "../util.js";

export function fetchProductListingViaStoreApi(trend, counter) {
  const category = getRandomItem(seoListingPage);
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/product-listing/${category.id}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.product_listing.fetch" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch product listing is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch product listing failed: ${resp.body}`);
  }

  return { categoryId: category.id, status: resp.status };
}
