import { Counter, Trend } from "k6/metrics";
import { fetchSeoUrlViaStoreApi } from "../../helpers/store-api/fetch-seo-url.js";

const APIFetchSeoUrlRT = new Trend("response_time_API_fetchSeoUrl");
const APIFetchSeoUrlCounter = new Counter("counter_API_fetchSeoUrl");

export default function () {
  fetchSeoUrlViaStoreApi(APIFetchSeoUrlRT, APIFetchSeoUrlCounter);
}
