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
import { sleep } from 'k6';

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


let StoreFrontRT = new Trend('response_time_StoreFront');
let StoreFrontCounter = new Counter('counter_StoreFront');

let SearchPageRT = new Trend('response_time_SearchPage');
let SearchPageCounter = new Counter('counter_SearchPage');

let NavigationPageRT = new Trend('response_time_NavigationPage');
let NavigationPageCounter = new Counter('counter_NavigationPage');

let ProductDetailPageRT = new Trend('response_time_ProductDetailPage');
let ProductDetailCounter = new Counter('counter_ProductDetail');

let guestRegisterPageRT = new Trend('response_time_guestRegister');
let guestRegisterPageCounter = new Counter('counter_guestRegisterPage');

let CartPageRT = new Trend('response_time_CartPage');
let CartPageCounter = new Counter('counter_CartPage');

let ConfirmPageRT = new Trend('response_time_ConfirmPage');
let ConfirmPageCounter = new Counter('counter_ConfirmPage');

let placeOrderRT = new Trend('response_time_placeOrder');
let orderCounter = new Counter('counter_orders');

let accountRegisterRT = new Trend('response_time_accountRegister');
let accountRegisterCounter = new Counter('counter_accountRegister');

let accountLoginRT = new Trend('response_time_accountLogin');
let accountLoginCounter = new Counter('counter_accountLogin');

let accountDashboardRT = new Trend('response_time_accountDashboard');
let accountDashboardCounter = new Counter('counter_accountDashboard');

let addProductToCartRT = new Trend('response_time_addProductToCart');
let addProductToCartCounter = new Counter('counter_addProductToCart');

let CartInfoRT = new Trend('response_time_CartInfo');
let CartInfoCounter = new Counter('counter_CartInfo');

let fetchBearerTokenRT = new Trend('response_time_fetchBearerToken');
let fetchBearerTokenCounter = new Counter('counter_fetchBearerToken');

let APIProductImportRT = new Trend('response_time_API_ProductImport');
let APIProductImportCounter = new Counter('counter_API_ProductImport');

let APIproductChangePriceRT = new Trend('response_time_API_productChangePrice');
let APIproductChangePriceCounter = new Counter('counter_API_productChangePrice');

let APIproductChangeStocksRT = new Trend('response_time_API_productChangeStocks');
let APIproductChangeStocksCounter = new Counter('counter_API_productChangeStocks');

export function setup() {
  const customerEmail = accountRegister(accountRegisterRT, accountRegisterCounter);
  const token = fetchBearerToken(fetchBearerTokenRT, fetchBearerTokenCounter);

  return { customerEmail, token };
}

export function browseOnly() {
  visitStorefront(StoreFrontRT, StoreFrontCounter);
  sleep(5);
  visitSearchPage(SearchPageRT, SearchPageCounter);
  sleep(5);
  visitNavigationPage(NavigationPageRT, NavigationPageCounter);
  sleep(5);
  visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter);
  sleep(5);
  visitNavigationPage(NavigationPageRT, NavigationPageCounter);
  sleep(5);
  visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter);
}

export function browseAndBuy() {
  visitStorefront(StoreFrontRT, StoreFrontCounter);
  sleep(5);
  visitNavigationPage(NavigationPageRT, NavigationPageCounter);
  sleep(5);

  // // 10% of the time, register an account
  // between(1, 10) <= 1 ? accountRegister() : guestRegister();

  guestRegister(guestRegisterPageRT, guestRegisterPageCounter);
  let cartItems = between(1, 10);
  for (let i = 0; i < cartItems + 1; i++) {
    visitNavigationPage(NavigationPageRT, NavigationPageCounter);
    sleep(15);
    visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter)
    sleep(15);
    addProductToCart(addProductToCartRT, addProductToCartCounter, CartInfoRT, CartInfoCounter, visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id);
  }

  visitCartPage(CartPageRT, CartPageCounter);
  sleep(15);
  visitConfirmPage(ConfirmPageRT, ConfirmPageCounter);
  sleep(30);
  placeOrder(orderCounter, placeOrderRT);
}

export function loggedInFastBuy(data) {
  accountLogin(accountLoginRT, accountLoginCounter, accountDashboardRT, accountDashboardCounter, data.customerEmail);
  sleep(15);
  addProductToCart(addProductToCartRT, addProductToCartCounter, CartInfoRT, CartInfoCounter, visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id);
  sleep(15);
  visitCartPage(CartPageRT, CartPageCounter);
  sleep(15);
  visitConfirmPage(ConfirmPageRT, ConfirmPageCounter);
  sleep(30);
  placeOrder(orderCounter, placeOrderRT);
}

export function apiImport(data) {
  useCredentials(data.token);
  productImport(APIProductImportRT, APIProductImportCounter, 20);
  productChangePrice(APIproductChangePriceRT, APIproductChangePriceCounter, 20);
  productChangeStocks(APIproductChangeStocksRT, APIproductChangeStocksCounter, 20);
}