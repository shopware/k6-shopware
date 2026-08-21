import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";

export function fetchCategoriesViaStoreApi(trend, counter) {
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/category`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.category.list" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch categories is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch categories failed: ${resp.body}`);
  }

  return { status: resp.status };
}
