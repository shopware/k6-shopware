import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";
import { getStoreApiContextToken } from "./utils.js";

export function fetchCheckoutGatewayViaStoreApi(trend, counter) {
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "sw-access-key": salesChannel[0].accessKey,
  };

  const contextResp = http.get(`${salesChannel[0].url}/store-api/context`, {
    headers: baseHeaders,
    tags: { name: "api.context.create" },
  });

  const contextToken = getStoreApiContextToken(contextResp);
  check(contextResp, {
    "Store API context request is successful": (r) => r.status === 200,
  });

  const headers = contextToken
    ? { ...baseHeaders, "sw-context-token": contextToken }
    : baseHeaders;

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/checkout/gateway`,
    "{}",
    {
      headers,
      tags: { name: "api.checkout.gateway" },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch checkout gateway is successful": (r) =>
      r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch checkout gateway failed: ${resp.body}`);
  }

  return { status: resp.status };
}
