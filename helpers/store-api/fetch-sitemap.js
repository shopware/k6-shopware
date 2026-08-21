import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";

export function fetchSitemapViaStoreApi(trend, counter) {
  const stepStart = Date.now();
  const resp = http.get(
    `${salesChannel[0].url}/store-api/sitemap`,
    {
      headers: {
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.sitemap.list" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch sitemap is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch sitemap failed: ${resp.body}`);
  }

  return { status: resp.status };
}
