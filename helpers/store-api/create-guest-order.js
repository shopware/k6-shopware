import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoProductDetailPage } from "../data.js";
import { getRandomItem } from "../util.js";
import {
  randomString,
  getStoreApiContextToken,
  mergeContextToken,
} from "./utils.js";
import { getAddToCartPayload } from "./payloads/add-to-cart.js";
import { getRegisterUserPayload } from "./payloads/register-user.js";
import { getCreateOrderPayload } from "./payloads/create-order.js";

export function createGuestOrderViaStoreApi(trend, counter, quantity = 1) {
  const flowStart = Date.now();
  const email = `k6-guest-${Date.now()}-${randomString()}@example.com`;
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "sw-access-key": salesChannel[0].accessKey,
  };
  const withContextHeaders = (contextToken) => {
    if (!contextToken) {
      return baseHeaders;
    }

    return {
      ...baseHeaders,
      "sw-context-token": contextToken,
    };
  };

  const contextResp = http.get(`${salesChannel[0].url}/store-api/context`, {
    headers: baseHeaders,
    tags: {
      name: "api.context.create",
    },
  });

  let contextToken = getStoreApiContextToken(contextResp);
  check(contextResp, {
    "Store API context request is successful": (r) => r.status === 200,
  });

  const productId = getRandomItem(seoProductDetailPage).id;
  const addToCartPayload = getAddToCartPayload({
    lineItemId: `k6-line-item-${Date.now()}-${randomString(6)}`,
    productId,
    quantity,
  });

  const addProductResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item`,
    JSON.stringify(addToCartPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: {
        name: "api.cart.add_line_item",
      },
    }
  );
  contextToken = mergeContextToken(contextToken, addProductResp);

  const addProductOk = check(addProductResp, {
    "Store API add product to cart is successful": (r) => r.status === 200,
  });

  const registerGuestPayload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    lastName: "Guest",
    email,
    countryId: salesChannel[0].countryIds[0],
    storefrontUrl: salesChannel[0].url,
    guest: true,
  });

  const registerGuestResp = http.post(
    `${salesChannel[0].url}/store-api/account/register`,
    JSON.stringify(registerGuestPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: {
        name: "api.account.register_guest",
      },
    }
  );
  contextToken = mergeContextToken(contextToken, registerGuestResp);

  const registerGuestOk = check(registerGuestResp, {
    "Store API guest registration is successful": (r) =>
      r.status === 200 || r.status === 204,
  });

  const createOrderResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/order`,
    JSON.stringify(getCreateOrderPayload()),
    {
      headers: withContextHeaders(contextToken),
      tags: {
        name: "api.checkout.order",
      },
    }
  );

  const createOrderOk = check(createOrderResp, {
    "Store API guest order is created": (r) => r.status === 200,
  });

  trend.add(Date.now() - flowStart);
  counter.add(1);

  if (!addProductOk || !registerGuestOk || !createOrderOk) {
    let orderErrorDetail = "";
    try {
      const orderBody = createOrderResp.json();
      orderErrorDetail = orderBody?.errors?.[0]?.detail || "";
    } catch {
      orderErrorDetail = "";
    }

    console.log(
      `Store API guest order flow failed: context=${contextResp.status}, addProduct=${addProductResp.status}, registerGuest=${registerGuestResp.status}, order=${createOrderResp.status}, detail=${orderErrorDetail}`
    );
  }

  return {
    email,
    status: createOrderResp.status,
    productId,
  };
}
