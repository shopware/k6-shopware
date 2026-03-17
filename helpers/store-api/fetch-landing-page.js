import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";

export function fetchLandingPageViaStoreApi(trend, counter, landingPageId) {
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/landing-page/${landingPageId}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.landing_page.fetch" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch landing page is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch landing page failed: ${resp.body}`);
  }

  return { landingPageId, status: resp.status };
}
