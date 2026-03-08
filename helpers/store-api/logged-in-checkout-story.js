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
import { getLoginUserPayload } from "./payloads/login-user.js";
import { getAddToCartPayload } from "./payloads/add-to-cart.js";
import { getFetchProductsPayload } from "./payloads/fetch-products.js";
import { getCreateOrderPayload } from "./payloads/create-order.js";

export function loggedInCheckoutStoryViaStoreApi(metrics, quantity = 1) {
  const email = `k6-checkout-${Date.now()}-${randomString()}@example.com`;
  const password = `k6-${randomString(16)}`;
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

  // Step 1: Create context
  let stepStart = Date.now();
  const contextResp = http.get(`${salesChannel[0].url}/store-api/context`, {
    headers: baseHeaders,
    tags: { name: "story.logged_in_checkout.context" },
  });
  metrics.context.trend.add(Date.now() - stepStart);
  metrics.context.counter.add(1);

  let contextToken = getStoreApiContextToken(contextResp);
  const contextOk = check(contextResp, {
    "Logged-in checkout story: context created": (r) => r.status === 200,
  });

  if (!contextOk) {
    console.log(
      `Logged-in checkout story aborted: context failed (status=${contextResp.status})`
    );
    return { success: false, step: "context" };
  }

  // Step 2: Register new user
  const registerPayload = getRegisterUserPayload({
    salutationId: salesChannel[0].salutationIds[0],
    email,
    password,
    countryId: salesChannel[0].countryIds[0],
    storefrontUrl: salesChannel[0].url,
    guest: false,
  });

  stepStart = Date.now();
  const registerResp = http.post(
    `${salesChannel[0].url}/store-api/account/register`,
    JSON.stringify(registerPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.register" },
    }
  );
  metrics.register.trend.add(Date.now() - stepStart);
  metrics.register.counter.add(1);
  contextToken = mergeContextToken(contextToken, registerResp);

  const registerOk = check(registerResp, {
    "Logged-in checkout story: user registered": (r) =>
      r.status === 200 || r.status === 204,
  });

  if (!registerOk) {
    console.log(
      `Logged-in checkout story aborted: register failed (status=${registerResp.status}, body=${registerResp.body})`
    );
    return { success: false, step: "register" };
  }

  // Step 3: Login with the newly created user
  stepStart = Date.now();
  const loginResp = http.post(
    `${salesChannel[0].url}/store-api/account/login`,
    JSON.stringify(getLoginUserPayload({ email, password })),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.login" },
    }
  );
  metrics.login.trend.add(Date.now() - stepStart);
  metrics.login.counter.add(1);
  contextToken = mergeContextToken(contextToken, loginResp);

  const loginOk = check(loginResp, {
    "Logged-in checkout story: login successful": (r) => r.status === 200,
  });

  if (!loginOk) {
    console.log(
      `Logged-in checkout story aborted: login failed (status=${loginResp.status}, body=${loginResp.body})`
    );
    return { success: false, step: "login" };
  }

  // Step 4: Fetch products
  stepStart = Date.now();
  const productsResp = http.post(
    `${salesChannel[0].url}/store-api/product`,
    JSON.stringify(getFetchProductsPayload({ limit: 10 })),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.fetch_products" },
    }
  );
  metrics.fetchProducts.trend.add(Date.now() - stepStart);
  metrics.fetchProducts.counter.add(1);
  contextToken = mergeContextToken(contextToken, productsResp);

  check(productsResp, {
    "Logged-in checkout story: products fetched": (r) => r.status === 200,
  });

  // Step 5: Add product to cart
  const productId = getRandomItem(seoProductDetailPage).id;
  const addToCartPayload = getAddToCartPayload({
    lineItemId: `k6-line-item-${Date.now()}-${randomString(6)}`,
    productId,
    quantity,
  });

  stepStart = Date.now();
  const addToCartResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/cart/line-item`,
    JSON.stringify(addToCartPayload),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.add_to_cart" },
    }
  );
  metrics.addToCart.trend.add(Date.now() - stepStart);
  metrics.addToCart.counter.add(1);
  contextToken = mergeContextToken(contextToken, addToCartResp);

  const addToCartOk = check(addToCartResp, {
    "Logged-in checkout story: product added to cart": (r) =>
      r.status === 200,
  });

  if (!addToCartOk) {
    console.log(
      `Logged-in checkout story aborted: add to cart failed (status=${addToCartResp.status}, body=${addToCartResp.body})`
    );
    return { success: false, step: "addToCart" };
  }

  // Step 6: Fetch cart
  stepStart = Date.now();
  const cartResp = http.get(`${salesChannel[0].url}/store-api/checkout/cart`, {
    headers: withContextHeaders(contextToken),
    tags: { name: "story.logged_in_checkout.fetch_cart" },
  });
  metrics.fetchCart.trend.add(Date.now() - stepStart);
  metrics.fetchCart.counter.add(1);
  contextToken = mergeContextToken(contextToken, cartResp);

  check(cartResp, {
    "Logged-in checkout story: cart fetched": (r) => r.status === 200,
  });

  // Step 7: Fetch shipping methods
  stepStart = Date.now();
  const shippingResp = http.post(
    `${salesChannel[0].url}/store-api/shipping-method`,
    "{}",
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.fetch_shipping_methods" },
    }
  );
  metrics.fetchShippingMethods.trend.add(Date.now() - stepStart);
  metrics.fetchShippingMethods.counter.add(1);
  contextToken = mergeContextToken(contextToken, shippingResp);

  check(shippingResp, {
    "Logged-in checkout story: shipping methods fetched": (r) =>
      r.status === 200,
  });

  // Step 8: Fetch payment methods
  stepStart = Date.now();
  const paymentResp = http.post(
    `${salesChannel[0].url}/store-api/payment-method`,
    "{}",
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.fetch_payment_methods" },
    }
  );
  metrics.fetchPaymentMethods.trend.add(Date.now() - stepStart);
  metrics.fetchPaymentMethods.counter.add(1);
  contextToken = mergeContextToken(contextToken, paymentResp);

  check(paymentResp, {
    "Logged-in checkout story: payment methods fetched": (r) =>
      r.status === 200,
  });

  // Step 9: Fetch checkout gateway
  stepStart = Date.now();
  const gatewayResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/gateway`,
    "{}",
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.gateway" },
    }
  );
  metrics.fetchCheckoutGateway.trend.add(Date.now() - stepStart);
  metrics.fetchCheckoutGateway.counter.add(1);
  contextToken = mergeContextToken(contextToken, gatewayResp);

  check(gatewayResp, {
    "Logged-in checkout story: checkout gateway fetched": (r) =>
      r.status === 200,
  });

  // Step 10: Place order
  stepStart = Date.now();
  const orderResp = http.post(
    `${salesChannel[0].url}/store-api/checkout/order`,
    JSON.stringify(getCreateOrderPayload()),
    {
      headers: withContextHeaders(contextToken),
      tags: { name: "story.logged_in_checkout.place_order" },
    }
  );
  metrics.placeOrder.trend.add(Date.now() - stepStart);
  metrics.placeOrder.counter.add(1);

  const orderOk = check(orderResp, {
    "Logged-in checkout story: order placed": (r) => r.status === 200,
  });

  if (!orderOk) {
    let detail = "";
    try {
      const body = orderResp.json();
      detail = body?.errors?.[0]?.detail || "";
    } catch {
      detail = "";
    }

    console.log(
      `Logged-in checkout story: place order failed (status=${orderResp.status}, detail=${detail})`
    );
  }

  return {
    success: orderOk,
    email,
    productId,
    orderStatus: orderResp.status,
  };
}
