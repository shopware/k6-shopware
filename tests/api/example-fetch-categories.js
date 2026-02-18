import { Counter, Trend } from "k6/metrics";
import { fetchCategoriesViaStoreApi } from "../../helpers/api.js";

const APIFetchCategoriesRT = new Trend("response_time_API_fetchCategories");
const APIFetchCategoriesCounter = new Counter("counter_API_fetchCategories");

export default function () {
  fetchCategoriesViaStoreApi(APIFetchCategoriesRT, APIFetchCategoriesCounter);
}
