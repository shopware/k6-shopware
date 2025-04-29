import {
	productChangePrice,
	productChangeStocks,
	fetchBearerToken,
	useCredentials,
	productImport,
} from './helpers/api.js';
import {
	accountRegister,
	addProductToCart,
	placeOrder,
	visitNavigationPage,
	visitProductDetailPage,
	visitSearchPage,
	visitStorefront,
} from './helpers/storefront.js';
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
		},
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

let placeOrderRT = new Trend('response_time_placeOrder');
let orderCounter = new Counter('counter_orders');

let accountRegisterRT = new Trend('response_time_accountRegister');
let accountRegisterCounter = new Counter('counter_accountRegister');

let addProductToCartRT = new Trend('response_time_addProductToCart');
let addProductToCartCounter = new Counter('counter_addProductToCart');

let CartInfoRT = new Trend('response_time_CartInfo');
let CartInfoCounter = new Counter('counter_CartInfo');

let fetchBearerTokenRT = new Trend('response_time_fetchBearerToken');
let fetchBearerTokenCounter = new Counter('counter_fetchBearerToken');

let APIProductImportRT = new Trend('response_time_API_ProductImport');
let APIProductImportCounter = new Counter('counter_API_ProductImport');

let APIproductChangePriceRT = new Trend('response_time_API_productChangePrice');
let APIproductChangePriceCounter = new Counter(
	'counter_API_productChangePrice',
);

let APIproductChangeStocksRT = new Trend(
	'response_time_API_productChangeStocks',
);
let APIproductChangeStocksCounter = new Counter(
	'counter_API_productChangeStocks',
);

export function browseOnly() {
	visitStorefront(StoreFrontRT, StoreFrontCounter);
	visitSearchPage(SearchPageRT, SearchPageCounter);
	visitNavigationPage(NavigationPageRT, NavigationPageCounter);
	visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter);
}

export function fastBuy() {
	addProductToCart(
		addProductToCartRT,
		addProductToCartCounter,
		CartInfoRT,
		CartInfoCounter,
		visitProductDetailPage(ProductDetailPageRT, ProductDetailCounter).id,
	);
	accountRegister(accountRegisterRT, accountRegisterCounter);
	placeOrder(orderCounter, placeOrderRT);
}

export function setup() {
	const token = fetchBearerToken(fetchBearerTokenRT, fetchBearerTokenCounter);

	return { token };
}

export function importer(data) {
	useCredentials(data.token);
	productImport(APIProductImportRT, APIProductImportCounter);
	productChangePrice(APIproductChangePriceRT, APIproductChangePriceCounter);
	productChangeStocks(
		APIproductChangeStocksRT,
		APIproductChangeStocksCounter,
	);
}
