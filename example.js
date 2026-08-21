import { Counter, Trend } from 'k6/metrics';
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

const StoreFrontRT = new Trend('response_time_StoreFront');
const StoreFrontCounter = new Counter('counter_StoreFront');

const SearchPageRT = new Trend('response_time_SearchPage');
const SearchPageCounter = new Counter('counter_SearchPage');

const NavigationPageRT = new Trend('response_time_NavigationPage');
const NavigationPageCounter = new Counter('counter_NavigationPage');

const ProductDetailPageRT = new Trend('response_time_ProductDetailPage');
const ProductDetailCounter = new Counter('counter_ProductDetail');

const CartPageRT = new Trend('response_time_CartPage');
const CartPageCounter = new Counter('counter_CartPage');

const ConfirmPageRT = new Trend('response_time_ConfirmPage');
const ConfirmPageCounter = new Counter('counter_ConfirmPage');

const placeOrderRT = new Trend('response_time_placeOrder');
const orderCounter = new Counter('counter_orders');

const accountRegisterRT = new Trend('response_time_accountRegister');
const accountRegisterCounter = new Counter('counter_accountRegister');

const addProductToCartRT = new Trend('response_time_addProductToCart');
const addProductToCartCounter = new Counter('counter_addProductToCart');

const CartInfoRT = new Trend('response_time_CartInfo');
const CartInfoCounter = new Counter('counter_CartInfo');

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
