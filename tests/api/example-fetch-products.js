import { Counter, Trend } from "k6/metrics";
import { fetchProductsViaStoreApi } from "../../helpers/api.js";

const APIFetchProductsRT = new Trend("response_time_API_fetchProducts");
const APIFetchProductsCounter = new Counter("counter_API_fetchProducts");

export default function () {
  fetchProductsViaStoreApi(APIFetchProductsRT, APIFetchProductsCounter);
}
