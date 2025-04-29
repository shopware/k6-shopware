import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import {
	fetchBearerToken,
	productChangePrice,
	productChangeStocks,
	productImport,
	useCredentials,
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

const StoreFrontRT = new Trend('response_time_StoreFront');
const StoreFrontCounter = new Counter('counter_StoreFront');

const SearchPageRT = new Trend('response_time_SearchPage');
const SearchPageCounter = new Counter('counter_SearchPage');

const NavigationPageRT = new Trend('response_time_NavigationPage');
const NavigationPageCounter = new Counter('counter_NavigationPage');

const ProductDetailPageRT = new Trend('response_time_ProductDetailPage');
const ProductDetailCounter = new Counter('counter_ProductDetail');

const placeOrderRT = new Trend('response_time_placeOrder');
const orderCounter = new Counter('counter_orders');

const accountRegisterRT = new Trend('response_time_accountRegister');
const accountRegisterCounter = new Counter('counter_accountRegister');

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
