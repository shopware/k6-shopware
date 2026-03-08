import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoListingPage } from "../data.js";
import { getRandomItem } from "../util.js";

export function fetchCategoryViaStoreApi(trend, counter) {
  const category = getRandomItem(seoListingPage);
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/category/${category.id}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: {
        name: "api.category.fetch",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API category fetch is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API category fetch failed: ${resp.body}`);
  }

  return { categoryId: category.id, status: resp.status };
}
