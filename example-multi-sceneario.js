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

export const options = {
  scenarios: {
    browse_only: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      exec: 'browseOnly',
    },
    fast_buy: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5m',
      exec: 'fastBuy',
    },
    import: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5m',
      exec: 'importer',
    }
  },
};

export function browseOnly() {
  visitStorefront();
  visitSearchPage();
  visitNavigationPage();
  visitProductDetailPage();
}

export function fastBuy() {
  addProductToCart(visitProductDetailPage().id);
  accountRegister();
  placeOrder();
}

export function setup() {
  const token = fetchBearerToken();

  return { token };
}

export function importer(data) {
  useCredentials(data.token);
  productImport();
  productChangePrice();
  productChangeStocks();
}