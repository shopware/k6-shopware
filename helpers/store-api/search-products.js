import { check } from "k6";
import http from "k6/http";
import { salesChannel, searchKeywords } from "../data.js";
import { getRandomItem } from "../util.js";
import { getSearchProductsPayload } from "./payloads/search-products.js";

export function searchProductsViaStoreApi(trend, counter) {
  const term = getRandomItem(searchKeywords);
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/search`,
    JSON.stringify(getSearchProductsPayload({ search: term })),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.search" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API search is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API search failed: ${resp.body}`);
  }

  return { term, status: resp.status };
}
