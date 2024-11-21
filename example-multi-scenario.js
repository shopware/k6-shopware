import { productChangePrice, productChangeStocks, fetchBearerToken, useCredentials, productImport } from "./helpers/api.js";
import {
  accountRegister,
  addProductToCart,
  placeOrder,
  visitNavigationPage,
  visitProductDetailPage,
  visitSearchPage,
  visitStorefront,
} from "./helpers/storefront.js";
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';

export const options = {
  scenarios: {
    browse_only: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      exec: 'browseOnly',
    },
    fast_buy: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      exec: 'fastBuy',
    },
    import: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      exec: 'importer',
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

export function browseOnly() {
  visitStorefront(StoreFrontRT);
  visitSearchPage(SearchPageRT);
  visitNavigationPage(NavigationPageRT);
  visitProductDetailPage(ProductDetailPageRT);
}

export function fastBuy() {
  addProductToCart(addProductToCartRT, CartInfoRT, visitProductDetailPage(ProductDetailPageRT).id);
  accountRegister(accountRegisterRT);
  placeOrder(orderCounter, placeOrderRT);
}

export function setup() {
  const token = fetchBearerToken(fetchBearerTokenRT);

  return { token };
}

export function importer(data) {
  useCredentials(data.token);
  productImport(APIProductImportRT);
  productChangePrice(APIproductChangePrice);
  productChangeStocks(APIproductChangeStocks);
}