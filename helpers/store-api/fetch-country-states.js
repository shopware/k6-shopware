import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";

export function fetchCountryStatesViaStoreApi(trend, counter) {
  const countryId = salesChannel[0].countryIds[0];
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/country-state/${countryId}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.country_state.list" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch country states is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch country states failed: ${resp.body}`);
  }

  return { countryId, status: resp.status };
}
