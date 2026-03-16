import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";
import {
  randomString,
  getStoreApiContextToken,
  mergeContextToken,
  getFirstProductIdFromProductListResponse,
} from "./utils.js";
import { getRegisterUserPayload } from "./payloads/register-user.js";
import { getLoginUserPayload } from "./payloads/login-user.js";
import { getAddToCartPayload } from "./payloads/add-to-cart.js";
import { getFetchProductsPayload } from "./payloads/fetch-products.js";

export function loggedInAddToCartStoryViaStoreApi(metrics, quantity = 1) {
  const email = `k6-cart-${Date.now()}-${randomString()}@example.com`;
  const password = `k6-${randomString(16)}`;
  const baseUrl = salesChannel[0].url;
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
  const requestOpts = (headers, name) => ({
    headers,
    tags: { name },
  });

  // Step 1: Create context
  let stepStart = Date.now();
  const contextResp = http.get(`${baseUrl}/store-api/context`, {
    ...requestOpts(baseHeaders, "story.logged_in_cart.context"),
  });
  metrics.context.trend.add(Date.now() - stepStart);
  metrics.context.counter.add(1);

  let contextToken = getStoreApiContextToken(contextResp);
  const contextOk = check(contextResp, {
    "Logged-in cart story: context created": (r) => r.status === 200,
  });

  if (!contextOk) {
    console.log(
      `Logged-in cart story aborted: context failed (status=${contextResp.status})`
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
    `${baseUrl}/store-api/account/register`,
    JSON.stringify(registerPayload),
    {
      ...requestOpts(withContextHeaders(contextToken), "story.logged_in_cart.register"),
    }
  );
  metrics.register.trend.add(Date.now() - stepStart);
  metrics.register.counter.add(1);
  contextToken = mergeContextToken(contextToken, registerResp);

  const registerOk = check(registerResp, {
    "Logged-in cart story: user registered": (r) =>
      r.status === 200 || r.status === 204,
  });

  if (!registerOk) {
    console.log(
      `Logged-in cart story aborted: register failed (status=${registerResp.status}, body=${registerResp.body})`
    );
    return { success: false, step: "register" };
  }

  // Step 3: Login with the newly created user
  stepStart = Date.now();
  const loginResp = http.post(
    `${baseUrl}/store-api/account/login`,
    JSON.stringify(getLoginUserPayload({ email, password })),
    {
      ...requestOpts(withContextHeaders(contextToken), "story.logged_in_cart.login"),
    }
  );
  metrics.login.trend.add(Date.now() - stepStart);
  metrics.login.counter.add(1);
  contextToken = mergeContextToken(contextToken, loginResp);

  const loginOk = check(loginResp, {
    "Logged-in cart story: login successful": (r) => r.status === 200,
  });

  if (!loginOk) {
    console.log(
      `Logged-in cart story aborted: login failed (status=${loginResp.status}, body=${loginResp.body})`
    );
    return { success: false, step: "login" };
  }

  // Step 4: Fetch products
  stepStart = Date.now();
  const productsResp = http.post(
    `${baseUrl}/store-api/product`,
    JSON.stringify(getFetchProductsPayload({ limit: 10 })),
    {
      ...requestOpts(withContextHeaders(contextToken), "story.logged_in_cart.fetch_products"),
    }
  );
  metrics.fetchProducts.trend.add(Date.now() - stepStart);
  metrics.fetchProducts.counter.add(1);
  contextToken = mergeContextToken(contextToken, productsResp);

  const productsOk = check(productsResp, {
    "Logged-in cart story: products fetched": (r) => r.status === 200,
  });
  const productId = getFirstProductIdFromProductListResponse(productsResp);
  const hasProduct = check(productsResp, {
    "Logged-in cart story: product list contains at least one product": () =>
      productId != null,
  });

  if (!productsOk || !hasProduct) {
    console.log(
      `Logged-in cart story aborted: product fetch failed or empty list (status=${productsResp.status})`
    );
    return { success: false, step: "fetchProducts" };
  }

  // Step 5: Add product to cart
  const addToCartPayload = getAddToCartPayload({
    lineItemId: `k6-line-item-${Date.now()}-${randomString(6)}`,
    productId,
    quantity,
  });

  stepStart = Date.now();
  const addToCartResp = http.post(
    `${baseUrl}/store-api/checkout/cart/line-item`,
    JSON.stringify(addToCartPayload),
    {
      ...requestOpts(withContextHeaders(contextToken), "story.logged_in_cart.add_to_cart"),
    }
  );
  metrics.addToCart.trend.add(Date.now() - stepStart);
  metrics.addToCart.counter.add(1);
  contextToken = mergeContextToken(contextToken, addToCartResp);

  const addToCartOk = check(addToCartResp, {
    "Logged-in cart story: product added to cart": (r) => r.status === 200,
  });

  if (!addToCartOk) {
    console.log(
      `Logged-in cart story: add to cart failed (status=${addToCartResp.status}, body=${addToCartResp.body})`
    );
  }

  // Step 6: Fetch cart
  stepStart = Date.now();
  const cartResp = http.get(`${baseUrl}/store-api/checkout/cart`, {
    ...requestOpts(withContextHeaders(contextToken), "story.logged_in_cart.fetch_cart"),
  });
  metrics.fetchCart.trend.add(Date.now() - stepStart);
  metrics.fetchCart.counter.add(1);

  check(cartResp, {
    "Logged-in cart story: cart fetched": (r) => r.status === 200,
  });

  return {
    success: addToCartOk,
    email,
    productId,
  };
}
