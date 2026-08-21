import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoListingPage } from "../data.js";
import { getRandomItem } from "../util.js";

export function fetchBreadcrumbViaStoreApi(trend, counter) {
  const category = getRandomItem(seoListingPage);
  const stepStart = Date.now();
  const resp = http.get(
    `${salesChannel[0].url}/store-api/breadcrumb/${category.id}`,
    {
      headers: {
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.breadcrumb.fetch" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch breadcrumb is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch breadcrumb failed: ${resp.body}`);
  }

  return { categoryId: category.id, status: resp.status };
}
