import { productChangePrice, fetchBearerToken, productImport, productChangeStocks, useCredentials } from "./helpers/api.js";

export function setup() {
    const token = fetchBearerToken();

    return { token };
}

export default (data) => {
    useCredentials(data.token);
    productImport(20);
    productChangePrice(20);
    productChangeStocks(20);
}
