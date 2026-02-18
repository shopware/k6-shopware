import { Counter, Trend } from "k6/metrics";
import { searchProductsViaStoreApi } from "../../helpers/api.js";

const APISearchProductsRT = new Trend("response_time_API_searchProducts");
const APISearchProductsCounter = new Counter("counter_API_searchProducts");

export default function () {
  searchProductsViaStoreApi(APISearchProductsRT, APISearchProductsCounter);
}
