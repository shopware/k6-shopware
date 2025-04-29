import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import {
	addProductToCart,
	guestRegister,
	placeOrder,
	visitCartPage,
	visitConfirmPage,
	visitProductDetailPage,
	visitStorefront,
} from './helpers/storefront.js';

const StoreFrontRT = new Trend('response_time_StoreFront');
const StoreFrontCounter = new Counter('counter_StoreFront');

const ProductDetailPageRT = new Trend('response_time_ProductDetailPage');
const ProductDetailCounter = new Counter('counter_ProductDetail');

const guestRegisterPageRT = new Trend('response_time_guestRegister');
const guestRegisterPageCounter = new Counter('counter_guestRegisterPage');

const CartPageRT = new Trend('response_time_CartPage');
const CartPageCounter = new Counter('counter_CartPage');

const ConfirmPageRT = new Trend('response_time_ConfirmPage');
const ConfirmPageCounter = new Counter('counter_ConfirmPage');

const placeOrderRT = new Trend('response_time_placeOrder');
const orderCounter = new Counter('counter_orders');

const addProductToCartRT = new Trend('response_time_addProductToCart');
const addProductToCartCounter = new Counter('counter_addProductToCart');

const CartInfoRT = new Trend('response_time_CartInfo');
const CartInfoCounter = new Counter('counter_CartInfo');

export default function () {
	visitStorefront(StoreFrontRT, StoreFrontCounter);
	guestRegister(guestRegisterPageRT, guestRegisterPageCounter);
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
