import {
	productChangePrice,
	fetchBearerToken,
	productImport,
	productChangeStocks,
	useCredentials,
} from './helpers/api.js';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';

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

export function setup() {
	const token = fetchBearerToken(fetchBearerTokenRT, fetchBearerTokenCounter);

	return { token };
}

export default (data) => {
	useCredentials(data.token);
	productImport(APIProductImportRT, APIProductImportCounter, 20);
	productChangePrice(
		APIproductChangePriceRT,
		APIproductChangePriceCounter,
		20,
	);
	productChangeStocks(
		APIproductChangeStocksRT,
		APIproductChangeStocksCounter,
		20,
	);
};
