import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";
import { getLoginUserPayload } from "./payloads/login-user.js";

export function loginUserViaStoreApi(
  trend,
  counter,
  email,
  password = "shopware"
) {
  const payload = getLoginUserPayload({ email, password });

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/account/login`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: {
        name: "api.account.login",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API account login is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API account login failed: ${resp.body}`);
  }

  return { email, status: resp.status };
}
