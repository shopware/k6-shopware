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
import { Trend } from 'k6/metrics';

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
let StoreFrontRT = new Trend('response_time_StoreFront');
let SearchPageRT = new Trend('response_time_SearchPage');
let NavigationPageRT = new Trend('response_time_NavigationPage');
let ProductDetailPageRT = new Trend('response_time_ProductDetailPage');
let guestRegisterPageRT = new Trend('response_time_guestRegister');
let CartPageRT = new Trend('response_time_CartPage');
let ConfirmPageRT = new Trend('response_time_ConfirmPage');
let placeOrderRT = new Trend('response_time_placeOrder');
let accountRegisterRT = new Trend('response_time_accountRegister');
let accountLoginRT = new Trend('response_time_accountLogin');
let accountDashboardRT = new Trend('response_time_accountDashboard');
let addProductToCartRT = new Trend('response_time_addProductToCart');
let CartInfoRT = new Trend('response_time_CartInfo');
let fetchBearerTokenRT = new Trend('response_time_fetchBearerToken');
let APIProductImportRT = new Trend('response_time_API_ProductImport');
let APIproductChangePrice = new Trend('response_time_API_productChangePrice');
let APIproductChangeStocks = new Trend('response_time_API_productChangeStocks');

export function setup() {
  const customerEmail = accountRegister(accountRegisterRT);
  const token = fetchBearerToken(fetchBearerTokenRT);

  return { customerEmail, token };
}

export function browseOnly() {
  visitStorefront(StoreFrontRT);
  visitSearchPage(SearchPageRT);
  visitNavigationPage(NavigationPageRT);
  visitProductDetailPage(ProductDetailPageRT);
  visitNavigationPage(NavigationPageRT);
  visitProductDetailPage(ProductDetailPageRT);
}

export function browseAndBuy() {
  visitStorefront(StoreFrontRT);
  visitNavigationPage(NavigationPageRT);

  // // 10% of the time, register an account
  // between(1, 10) <= 1 ? accountRegister() : guestRegister();

  guestRegister(guestRegisterPageRT);
  let cartItems = between(1, 10);
  for (let i = 0; i < cartItems + 1; i++) {
    visitNavigationPage(NavigationPageRT);
    visitProductDetailPage(ProductDetailPageRT)
    addProductToCart(addProductToCartRT, CartInfoRT, visitProductDetailPage(ProductDetailPageRT).id);
  }

  visitCartPage(CartPageRT);
  visitConfirmPage(ConfirmPageRT);
  placeOrder(orderCounter, placeOrderRT);
}

export function loggedInFastBuy(data) {
  accountLogin(accountLoginRT, accountDashboardRT, data.customerEmail);
  addProductToCart(addProductToCartRT, CartInfoRT, visitProductDetailPage(ProductDetailPageRT).id);
  visitCartPage(CartPageRT);
  visitConfirmPage(ConfirmPageRT);
  placeOrder(orderCounter, placeOrderRT);
}

export function apiImport(data) {
  useCredentials(data.token);
  productImport(APIProductImportRT, 20);
  productChangePrice(APIproductChangePrice, 20);
  productChangeStocks(APIproductChangeStocks, 20);
}