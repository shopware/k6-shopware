import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";
import { randomString } from "./utils.js";
import { getRegisterUserPayload } from "./payloads/register-user.js";

export function registerNewUserViaStoreApi(trend, counter) {
  const email = `k6-user-${Date.now()}-${randomString()}@example.com`;
  const payload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    email,
    countryId: salesChannel[0].countryIds[0],
    storefrontUrl: salesChannel[0].url,
    guest: false,
  });

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/account/register`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: {
        name: "api.account.register",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API account registration is successful": (r) =>
      r.status === 200 || r.status === 204,
  });

  if (!success) {
    console.log(`Store API account registration failed: ${resp.body}`);
  }

  return { email, status: resp.status };
}
