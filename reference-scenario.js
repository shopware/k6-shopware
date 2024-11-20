import {
  accountLogin,
  accountRegister,
  addProductToCart, guestRegister,
  placeOrder, visitCartPage, visitConfirmPage,
  visitNavigationPage,
  visitProductDetailPage,
  visitSearchPage,
  visitStorefront,
} from "./helpers/storefront.js";
import { productChangePrice, fetchBearerToken, productImport, productChangeStocks, useCredentials } from "./helpers/api.js";
import { between } from "./helpers/util.js";
import { Counter } from 'k6/metrics';

export const options = {
  scenarios: {
    browse_only: {
      executor: 'constant-vus',
      vus: 45,
      duration: '5m',
      exec: 'browseOnly',
    },
    browse_and_buy: {
      executor: 'constant-vus',
      vus: 4,
      duration: '5m',
      exec: 'browseAndBuy',
    },
    logged_in_fast_buy: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5m',
      exec: 'loggedInFastBuy',
    },
    api_import: {
      executor: 'constant-vus',
      vus: 2,
      duration: '5m',
      exec: 'apiImport',
    }
  },
};

let orderCounter = new Counter('orders');

export function setup() {
  const customerEmail = accountRegister();
  const token = fetchBearerToken();

  return { customerEmail, token };
}

export function browseOnly() {
  visitStorefront();
  visitSearchPage();
  visitNavigationPage();
  visitProductDetailPage();
  visitNavigationPage();
  visitProductDetailPage();
}

export function browseAndBuy() {
  visitStorefront();
  visitNavigationPage();

  // // 10% of the time, register an account
  // between(1, 10) <= 1 ? accountRegister() : guestRegister();

  guestRegister();
  let cartItems = between(1, 10);
  for (let i = 0; i < cartItems + 1; i++) {
    visitNavigationPage();
    visitProductDetailPage()
    addProductToCart(visitProductDetailPage().id);
  }

  visitCartPage();
  visitConfirmPage();
  placeOrder(orderCounter);
}

export function loggedInFastBuy(data) {
  accountLogin(data.customerEmail);
  addProductToCart(visitProductDetailPage().id);
  visitCartPage();
  visitConfirmPage();
  placeOrder(orderCounter);
}

export function apiImport(data) {
  useCredentials(data.token);
  productImport(20);
  productChangePrice(20);
  productChangeStocks(20);
}