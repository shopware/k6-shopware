import { Counter, Trend } from "k6/metrics";
import { fetchCategoryViaStoreApi } from "../../helpers/store-api/fetch-category.js";

const APIFetchCategoryRT = new Trend("response_time_API_fetchCategory");
const APIFetchCategoryCounter = new Counter("counter_API_fetchCategory");

export default function () {
  fetchCategoryViaStoreApi(APIFetchCategoryRT, APIFetchCategoryCounter);
}
