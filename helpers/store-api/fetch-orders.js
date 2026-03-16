import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoProductDetailPage } from "../data.js";
import { getRandomItem } from "../util.js";
import {
  randomString,
  getStoreApiContextToken,
  mergeContextToken,
} from "./utils.js";
import { getRegisterUserPayload } from "./payloads/register-user.js";
import { getAddToCartPayload } from "./payloads/add-to-cart.js";
import { getCreateOrderPayload } from "./payloads/create-order.js";
import { getListOrdersPayload } from "./payloads/list-orders.js";

export function fetchOrdersViaStoreApi(trend, counter) {
  const flowStart = Date.now();
  const email = `k6-orders-${Date.now()}-${randomString()}@example.com`;
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "sw-access-key": salesChannel[0].accessKey,
  };
  const withContextHeaders = (contextToken) =>
    contextToken
      ? { ...baseHeaders, "sw-context-token": contextToken }
      : baseHeaders;

  const contextResp = http.get(`${salesChannel[0].url}/store-api/context`, {
    headers: baseHeaders,
    tags: { name: "api.context.create" },
  });
  check(contextResp, {
    "Store API fetch orders: context created": (r) => r.status === 200,
  });
  let contextToken = getStoreApiContextToken(contextResp);

  const productId = getRandomItem(seoProductDetailPage).id;
  const addResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item`,
    JSON.stringify(
      getAddToCartPayload({
        lineItemId: `k6-line-item-${Date.now()}-${randomString(6)}`,
        productId,
      })
    ),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.cart.add_line_item" },
    }
  );
  check(addResp, {
    "Store API fetch orders: product added to cart": (r) => r.status === 200,
  });
  contextToken = mergeContextToken(contextToken, addResp);

  const registerPayload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    email,
    countryId: salesChannel[0].countryIds[0],
    storefrontUrl: salesChannel[0].url,
    guest: true,
  });
  const registerResp = http.post(
    `${salesChannel[0].url}/store-api/account/register`,
    JSON.stringify(registerPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.account.register_guest" },
    }
  );
  check(registerResp, {
    "Store API fetch orders: guest registered": (r) =>
      r.status === 200 || r.status === 204,
  });
  contextToken = mergeContextToken(contextToken, registerResp);

  const orderResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/order`,
    JSON.stringify(getCreateOrderPayload()),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.checkout.order" },
    }
  );

  check(orderResp, {
    "Store API fetch orders: order placed": (r) =>
      r.status === 200 || r.status === 201,
  });

  let orderId = null;
  try {
    const body = orderResp.json();
    orderId = body?.orders?.elements?.[0]?.id ?? body?.id ?? null;
  } catch {
    orderId = null;
  }

  const orderCreated = (orderResp.status === 200 || orderResp.status === 201) && orderId;
  if (!orderCreated) {
    console.log(
      `Store API fetch orders skipped: order creation failed or no orderId (status=${orderResp.status})`
    );
    trend.add(Date.now() - flowStart);
    counter.add(1);
    check(null, {
      "Store API fetch orders: order created and orderId returned": () =>
        false,
    });
    return { orderId: null, status: 0 };
  }

  const resp = http.post(
    `${salesChannel[0].url}/store-api/order`,
    JSON.stringify(getListOrdersPayload({ limit: 10 })),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "api.order.list" },
    }
  );
  trend.add(Date.now() - flowStart);
  counter.add(1);

  let orders = [];
  try {
    const body = resp.json();
    orders = body?.orders?.elements ?? body?.data ?? [];
  } catch {
    // leave orders empty
  }

  const listOk = check(resp, {
    "Store API fetch orders: list returns 200": (r) => r.status === 200,
  });
  const hasOrders = check(resp, {
    "Store API fetch orders: list contains orders": () =>
      Array.isArray(orders) && orders.length > 0,
  });
  const containsCreatedOrder = check(resp, {
    "Store API fetch orders: list contains created order": () =>
      orders.some((o) => o?.id === orderId),
  });

  if (!listOk || !hasOrders || !containsCreatedOrder) {
    console.log(`Store API fetch orders failed: ${resp.body}`);
  }

  return { orderId, status: resp.status };
}
