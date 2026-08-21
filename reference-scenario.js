import { sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import {
	fetchBearerToken,
	productChangePrice,
	productChangeStocks,
	productImport,
	useCredentials,
} from './helpers/api.js';
import {
	accountLogin,
	accountRegister,
	addProductToCart,
	guestRegister,
	placeOrder,
	visitCartPage,
	visitConfirmPage,
	visitNavigationPage,
	visitProductDetailPage,
	visitSearchPage,
	visitStorefront,
} from './helpers/storefront.js';
import { between } from './helpers/util.js';

export const options = {
	cloud: {
		distribution: {
			distributionLabel1: {
				loadZone: 'amazon:de:frankfurt',
				percent: 20,
			},
			distributionLabel2: { loadZone: 'amazon:fr:paris', percent: 20 },
			distributionLabel3: {
				loadZone: 'amazon:se:stockholm',
				percent: 20,
			},
			distributionLabel4: { loadZone: 'amazon:it:milan', percent: 20 },
			distributionLabel5: { loadZone: 'amazon:gb:london', percent: 20 },
		},
	},
	scenarios: {
		browse_only: {
			executor: 'constant-vus',
			vus: 50,
			duration: '5m',
			exec: 'browseOnly',
		},
		browse_and_buy: {
			executor: 'constant-vus',
			vus: 1,
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
		},
	},
};

const pause = 0.7;
const pause_buy = 1.3;
const pause_api = 0.05;

const StoreFrontRT = new Trend('response_time_StoreFront');
const StoreFrontCounter = new Counter('counter_StoreFront');

const SearchPageRT = new Trend('response_time_SearchPage');
const SearchPageCounter = new Counter('counter_SearchPage');

const NavigationPageRT = new Trend('response_time_NavigationPage');
const NavigationPageCounter = new Counter('counter_NavigationPage');

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

const accountRegisterRT = new Trend('response_time_accountRegister');
const accountRegisterCounter = new Counter('counter_accountRegister');

const accountLoginRT = new Trend('response_time_accountLogin');
const accountLoginCounter = new Counter('counter_accountLogin');

const accountDashboardRT = new Trend('response_time_accountDashboard');
const accountDashboardCounter = new Counter('counter_accountDashboard');

const addProductToCartRT = new Trend('response_time_addProductToCart');
const addProductToCartCounter = new Counter('counter_addProductToCart');

const CartInfoRT = new Trend('response_time_CartInfo');
const CartInfoCounter = new Counter('counter_CartInfo');

const fetchBearerTokenRT = new Trend('response_time_fetchBearerToken');
const fetchBearerTokenCounter = new Counter('counter_fetchBearerToken');

const APIProductImportRT = new Trend('response_time_API_ProductImport');
const APIProductImportCounter = new Counter('counter_API_ProductImport');

const APIproductChangePriceRT = new Trend(
	'response_time_API_productChangePrice',
);
const APIproductChangePriceCounter = new Counter(
	'counter_API_productChangePrice',
);

const APIproductChangeStocksRT = new Trend(
	'response_time_API_productChangeStocks',
);
const APIproductChangeStocksCounter = new Counter(
	'counter_API_productChangeStocks',
);

const visitors_browseOnly = new Counter('visitors_browseOnly');
const visitors_browseAndBuy = new Counter('visitors_browseAndBuy');
const visitors_loggedInFastBuy = new Counter('visitors_loggedInFastBuy');

export function setup() {
	const customerEmail = accountRegister(
		accountRegisterRT,
		accountRegisterCounter,
	);
	const token = fetchBearerToken(fetchBearerTokenRT, fetchBearerTokenCounter);

	return { customerEmail, token };
}

export function browseOnly() {
	visitStorefront(StoreFrontRT, StoreFrontCounter);
	sleep(pause);
	visitSearchPage(SearchPageRT, SearchPageCounter);
	sleep(pause);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	sleep(pause);
	visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter);
	sleep(pause);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	sleep(pause);
	visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter);
	sleep(pause);

	visitors_browseOnly.add(1);
}

export function browseAndBuy() {
	visitStorefront(StoreFrontRT, StoreFrontCounter);
	sleep(pause);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	sleep(pause);

	// // 10% of the time, register an account
	// between(1, 10) <= 1 ? accountRegister() : guestRegister();

	guestRegister(guestRegisterPageRT, guestRegisterPageCounter);
	sleep(pause_buy);
	const cartItems = between(1, 10);
	for (let i = 0; i < cartItems + 1; i++) {
		visitNavigationPage(NavigationPageRT, NavigationPageCounter);
		sleep(pause);
		visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter);
		sleep(pause);
		addProductToCart(
			addProductToCartRT,
			addProductToCartCounter,
			CartInfoRT,
			CartInfoCounter,
			visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter)
				.id,
		);
		sleep(pause);
	}

	visitCartPage(CartPageRT, CartPageCounter);
	sleep(pause_buy);
	visitConfirmPage(ConfirmPageRT, ConfirmPageCounter);
	sleep(pause_buy);
	placeOrder(orderCounter, placeOrderRT);
	sleep(pause_buy);

	visitors_browseAndBuy.add(1);
}

export function loggedInFastBuy(data) {
	accountLogin(
		accountLoginRT,
		accountLoginCounter,
		accountDashboardRT,
		accountDashboardCounter,
		data.customerEmail,
	);
	sleep(pause_buy);
	addProductToCart(
		addProductToCartRT,
		addProductToCartCounter,
		CartInfoRT,
		CartInfoCounter,
		visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id,
	);
	sleep(pause_buy);
	visitCartPage(CartPageRT, CartPageCounter);
	sleep(pause_buy);
	visitConfirmPage(ConfirmPageRT, ConfirmPageCounter);
	sleep(pause_buy);
	placeOrder(orderCounter, placeOrderRT);
	sleep(pause_buy);

	visitors_loggedInFastBuy.add(1);
}

export function apiImport(data) {
	useCredentials(data.token);
	productImport(APIProductImportRT, APIProductImportCounter, 20);
	sleep(pause_api);
	productChangePrice(
		APIproductChangePriceRT,
		APIproductChangePriceCounter,
		20,
	);
	sleep(pause_api);
	productChangeStocks(
		APIproductChangeStocksRT,
		APIproductChangeStocksCounter,
		20,
	);
	sleep(pause_api);
}
