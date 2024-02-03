import { check } from "k6";
import http from "k6/http";
import { parseHTML } from "k6/html";
import { SharedArray } from "k6/data";
import { getRandomItem, postFormData } from "./util.js";

const salesChannel = new SharedArray("salesChannel", function () {
  return JSON.parse(open("../fixtures/sales-channel.json"));
});

const seoProductDetailPage = new SharedArray(
  "seoProductDetailPage",
  function () {
    return JSON.parse(open("../fixtures/seo-frontend.detail.page.json"));
  },
);

const seoListingPage = new SharedArray("seoListingPage", function () {
  return JSON.parse(open("../fixtures/seo-frontend.navigation.page.json"));
});

export function visitStorefront() {
  const r = http.get(salesChannel[0].url);
  check(r, {
    "Loaded Startpage": (r) => r.status === 200,
  });
}

export function accountRegister() {
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const email = `${randomString}@test.de`;

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
  });

  check(register, {
    "Account has been created": (r) => r.status === 200,
    "User is logged-in": (r) => r.body.includes("Your profile"),
  });

  return email;
}

export function accountLogin(email, password = "shopware") {
  const login = postFormData(`${salesChannel[0].url}/account/login`, {
    username: email,
    password: password,
  });

  check(login, {
    "Login successfull": (r) => r.status === 200,
  });

  visitAccountDashboard();
}

export function visitAccountDashboard() {
  const accountPage = http.get(`${salesChannel[0].url}/account`);
  check(accountPage, {
    "Check user is really logged-in": (r) => r.body.includes("John Doe"),
  });
}

export function visitProductDetailPage() {
  const page = getRandomItem(seoProductDetailPage);
  const productDetailPage = http.get(page.url, {
    tags: {
      route: "frontend.detail.page",
    },
  });
  check(productDetailPage, {
    "Check product detail page": (r) => r.status === 200 || r.status === 404,
  });

  return page;
}

export function visitMavigationPage() {
  const page = getRandomItem(seoListingPage);
  const productDetailPage = http.get(page.url, {
    tags: {
      route: "frontend.navigation.page",
    },
  });
  check(productDetailPage, {
    "Check product detail page": (r) => r.status === 200 || r.status === 404,
  });

  return page;
}

export function getCartInfo() {
  const cartInfo = http.get(`${salesChannel[0].url}/widgets/checkout/info`, {
    tags: {
      route: "frontend.checkout.cart.page",
    },
  });
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

export function addProductToCart(productId) {
  const data = {
    redirectTo: "frontend.checkout.cart.page",
  };

  data[`lineItems[${productId}][quantity]`] = "1";
  data[`lineItems[${productId}][id]`] = productId;
  data[`lineItems[${productId}][type]`] = "product";
  data[`lineItems[${productId}][referencedId]`] = productId;
  data[`lineItems[${productId}][stackable]`] = "1";
  data[`lineItems[${productId}][removable]`] = "1";

  const before = getCartInfo();

  const addItem = postFormData(
    `${salesChannel[0].url}/checkout/line-item/add`,
    data,
  );

  const after = getCartInfo();

  check(after, {
    "Item added to cart": (after) => after.count != before.count,
  });
}

export function visitCartPage() {
  const res = http.get(`${salesChannel[0].url}/checkout/cart`);

  check(res, {
    "Cart page is loaded": (r) => r.status === 200,
  });
}

export function visitConfirmPage() {
  const res = http.get(`${salesChannel[0].url}/checkout/confirm`);

  check(res, {
    "Confirm page is loaded": (r) => r.status === 200,
  });
}

export function placeOrder() {
  const res = postFormData(`${salesChannel[0].url}/checkout/order`, {
    tos: "on",
  });

  check(res, {
    "Order placed": (r) =>
      r.status === 200 && r.body.includes("finish-order-details"),
  });

  const parsed = parseHTML(res.body);

  return parsed
    .find(".finish-ordernumber[data-order-number]")
    .attr("data-order-number")
    .trim();
}
