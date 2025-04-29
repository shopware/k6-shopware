import {
	accountRegister,
	addProductToCart,
	placeOrder,
	visitCartPage,
	visitConfirmPage,
	visitNavigationPage,
	visitProductDetailPage,
	visitSearchPage,
	visitStorefront,
} from './helpers/storefront.js';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';

let StoreFrontRT = new Trend('response_time_StoreFront');
let StoreFrontCounter = new Counter('counter_StoreFront');

let SearchPageRT = new Trend('response_time_SearchPage');
let SearchPageCounter = new Counter('counter_SearchPage');

let NavigationPageRT = new Trend('response_time_NavigationPage');
let NavigationPageCounter = new Counter('counter_NavigationPage');

let ProductDetailPageRT = new Trend('response_time_ProductDetailPage');
let ProductDetailCounter = new Counter('counter_ProductDetail');

let CartPageRT = new Trend('response_time_CartPage');
let CartPageCounter = new Counter('counter_CartPage');

let ConfirmPageRT = new Trend('response_time_ConfirmPage');
let ConfirmPageCounter = new Counter('counter_ConfirmPage');

let placeOrderRT = new Trend('response_time_placeOrder');
let orderCounter = new Counter('counter_orders');

let accountRegisterRT = new Trend('response_time_accountRegister');
let accountRegisterCounter = new Counter('counter_accountRegister');

let addProductToCartRT = new Trend('response_time_addProductToCart');
let addProductToCartCounter = new Counter('counter_addProductToCart');

let CartInfoRT = new Trend('response_time_CartInfo');
let CartInfoCounter = new Counter('counter_CartInfo');

export default function () {
	visitStorefront(StoreFrontRT, StoreFrontCounter);
	visitSearchPage(SearchPageRT, SearchPageCounter);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	accountRegister(accountRegisterRT, accountRegisterCounter);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	addProductToCart(
		addProductToCartRT,
		addProductToCartCounter,
		CartInfoRT,
		CartInfoCounter,
		visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id,
	);
	visitSearchPage(SearchPageRT, SearchPageCounter);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	visitSearchPage(SearchPageRT, SearchPageCounter);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	addProductToCart(
		addProductToCartRT,
		addProductToCartCounter,
		CartInfoRT,
		CartInfoCounter,
		visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id,
	);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	addProductToCart(
		addProductToCartRT,
		addProductToCartCounter,
		CartInfoRT,
		CartInfoCounter,
		visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id,
	);
	visitCartPage(CartPageRT, CartPageCounter);
	visitConfirmPage(ConfirmPageRT, ConfirmPageCounter);
	placeOrder(orderCounter, placeOrderRT);
}
