import { productChangePrice, fetchBearerToken, productImport, productChangeStocks, useCredentials } from "./helpers/api.js";
import { Trend } from 'k6/metrics';

let fetchBearerTokenRT = new Trend('response_time_fetchBearerToken');
let APIProductImportRT = new Trend('response_time_API_ProductImport');
let APIproductChangePrice = new Trend('response_time_API_productChangePrice');
let APIproductChangeStocks = new Trend('response_time_API_productChangeStocks');

export function setup() {
    const token = fetchBearerToken(fetchBearerTokenRT);

    return { token };
}

export default (data) => {
    useCredentials(data.token);
    productImport(APIProductImportRT, 20);
    productChangePrice(APIproductChangePrice, 20);
    productChangeStocks(APIproductChangeStocks, 20);
}
