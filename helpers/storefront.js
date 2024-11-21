import { check } from "k6";
import http from "k6/http";
import { parseHTML } from "k6/html";
import { getRandomItem, postFormData } from "./util.js";
import { salesChannel, searchKeywords, seoListingPage, seoProductDetailPage } from './data.js';

export function visitStorefront(trend) {
  let stepStart = Date.now();
  const r = http.get(salesChannel[0].url);
  trend.add(Date.now() - stepStart);
  check(r, {
    "Loaded Startpage": (r) => r.status === 200,
  });
}

export function accountRegister(trend) {
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const email = `${randomString}@test.de`;

  let stepStart = Date.now();
  const register = postFormData(`${salesChannel[0].url}/account/register`, {
    redirectTo: "frontend.account.home.page",
    salutationId: salesChannel[0].salutationIds[0],
    firstName: "John",
    lastName: "Doe",
    email: email,
    password: "shopware",
    createCustomerAccount: "true",
    "billingAddress[street]": "Test Strasse 1",
    "billingAddress[zipcode]": "12345",
    "billingAddress[city]": "Test City",
    "billingAddress[countryId]": salesChannel[0].countryIds[0],
  }, "frontend.account.register");
  trend.add(Date.now() - stepStart);

  check(register, {
    "Account has been created": (r) => r.status === 200,
    "User is logged-in": (r) => r.body.includes("Your profile"),
  });

  return email;
}

export function guestRegister(trend) {
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const email = `${randomString}@test.de`;

  // guest "registration" with `guest: true`
  let stepStart = Date.now();
  const register = postFormData(`${salesChannel[0].url}/account/register`, {
    redirectTo: "frontend.account.home.page",
    salutationId: salesChannel[0].salutationIds[0],
    firstName: "John",
    lastName: "Doe",
    email: email,
    password: "shopware",
    guest: "true", // guest flag
    "billingAddress[street]": "Test Strasse 1",
    "billingAddress[zipcode]": "12345",
    "billingAddress[city]": "Test City",
    "billingAddress[countryId]": salesChannel[0].countryIds[0],
  }, "frontend.account.register");
  trend.add(Date.now() - stepStart);

  check(register, {
    "Guest account created": (r) => r.status === 200,
  });
  return email;
}

export function accountLogin(trend, trendAccountDashboard, email, password = "shopware") {
  let stepStart = Date.now();
  const login = postFormData(`${salesChannel[0].url}/account/login`, {
    username: email,
    password: password,
  }, "frontend.account.login");
  trend.add(Date.now() - stepStart);

  check(login, {
    "Login successfull": (r) => r.status === 200,
  });

  visitAccountDashboard(trendAccountDashboard);
}

export function visitAccountDashboard(trend) {
  let stepStart = Date.now();
  const accountPage = http.get(`${salesChannel[0].url}/account`);
  trend.add(Date.now() - stepStart);
  check(accountPage, {
    "Check user is really logged-in": (r) => r.body.includes("John Doe"),
  });
}

export function visitProductDetailPage(trend) {
  const page = getRandomItem(seoProductDetailPage);

  let stepStart = Date.now();
  const productDetailPage = http.get(page.url, {
    tags: {
      name: "frontend.detail.page",
    },
  });
  trend.add(Date.now() - stepStart);
  check(productDetailPage, {
    "Check product detail page": (r) => r.status === 200 || r.status === 404,
  });

  return page;
}

export function visitNavigationPage(trend) {
  const page = getRandomItem(seoListingPage);

  let stepStart = Date.now();
  const productDetailPage = http.get(page.url, {
    tags: {
      name: "frontend.navigation.page",
    },
  });
  trend.add(Date.now() - stepStart);

  check(productDetailPage, {
    "Check navigation page": (r) => r.status === 200 || r.status === 404,
  });

  return page;
}

export function getCartInfo(trend) {
  let stepStart = Date.now();
  const cartInfo = http.get(`${salesChannel[0].url}/widgets/checkout/info`, {
    tags: {
      name: "frontend.cart.widget",
    },
  });
  trend.add(Date.now() - stepStart);
  check(cartInfo, {
    "Check cart info": (r) => r.status === 200 || r.status === 204,
  });

  if (cartInfo.status === 204) {
    return {
      count: "0",
      total: "0",
    };
  }

  const doc = parseHTML(cartInfo.body);

  return {
    count: doc.find(".header-cart-badge").text().trim(),
    total: doc.find(".header-cart-total").text().trim(),
  };
}

export function addProductToCart(trend, trendCartInfo, productId) {
  const data = {
    redirectTo: "frontend.checkout.cart.page",
  };

  data[`lineItems[${productId}][quantity]`] = "1";
  data[`lineItems[${productId}][id]`] = productId;
  data[`lineItems[${productId}][type]`] = "product";
  data[`lineItems[${productId}][referencedId]`] = productId;
  data[`lineItems[${productId}][stackable]`] = "1";
  data[`lineItems[${productId}][removable]`] = "1";

  const before = getCartInfo(trendCartInfo);

  let stepStart = Date.now();
  postFormData(`${salesChannel[0].url}/checkout/line-item/add`, data, "frontend.checkout.line-item.add");
  trend.add(Date.now() - stepStart);

  const after = getCartInfo(trendCartInfo);

  check(after, {
    "Item added to cart": (after) => after.total != before.total,
  });
}

export function visitCartPage(trend) {
  let stepStart = Date.now();
  const res = http.get(`${salesChannel[0].url}/checkout/cart`);
  trend.add(Date.now() - stepStart);

  check(res, {
    "Cart page is loaded": (r) => r.status === 200,
  });
}

export function visitConfirmPage(trend) {
  let stepStart = Date.now();
  const res = http.get(`${salesChannel[0].url}/checkout/confirm`, {
    tags: {
      name: "frontend.checkout.confirm.page",
    },
  });
  trend.add(Date.now() - stepStart);

  check(res, {
    "Confirm page is loaded": (r) => r.status === 200,
  });
}

export function visitSearchPage(trend) {
  const term = getRandomItem(searchKeywords);

  let stepStart = Date.now();
  const res = http.get(
    `${salesChannel[0].url}/search?search=${encodeURIComponent(term)}`,
    {
      tags: {
        name: "frontend.search.page",
      },
    },
  );
  trend.add(Date.now() - stepStart);

  check(res, {
    "Search page is loaded": (r) => r.status === 200,
  });
}

export function placeOrder(orderCounter, trend) {
  let stepStart = Date.now();
  const res = postFormData(`${salesChannel[0].url}/checkout/order`, {
    tos: "on",
    revocation: "on",
  }, 'frontend.checkout.order');
  trend.add(Date.now() - stepStart);

  const orderPlaced = check(res, {
    "Order placed": (r) => r.status === 200 && r.body.includes("finish-order-details"),
  });

  if (orderPlaced && orderCounter) {
    orderCounter.add(1);
  }
}
