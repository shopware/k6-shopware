import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";

export function fetchInfoRoutesViaStoreApi(trend, counter) {
  const stepStart = Date.now();
  const resp = http.get(
    `${salesChannel[0].url}/store-api/_info/routes`,
    {
      headers: {
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.info.routes" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch info routes is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch info routes failed: ${resp.body}`);
  }

  return { status: resp.status };
}
