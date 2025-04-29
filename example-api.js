import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import {
	fetchBearerToken,
	productChangePrice,
	productChangeStocks,
	productImport,
	useCredentials,
} from './helpers/api.js';

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
