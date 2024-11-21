import {
  accountRegister,
  addProductToCart,
  placeOrder,
  visitCartPage,
  visitConfirmPage,
  visitProductDetailPage,
  visitStorefront,
} from "./helpers/storefront.js";
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';

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

export default function () {
  visitStorefront(StoreFrontRT);
  accountRegister(accountRegisterRT);
  addProductToCart(addProductToCartRT, CartInfoRT, visitProductDetailPage(ProductDetailPageRT).id);
  visitCartPage(CartPageRT);
  visitConfirmPage(ConfirmPageRT);
  placeOrder(orderCounter, placeOrderRT);
}
