import { Counter, Trend } from "k6/metrics";
import { fetchSeoUrlViaStoreApi } from "../../helpers/api.js";

const APIFetchSeoUrlRT = new Trend("response_time_API_fetchSeoUrl");
const APIFetchSeoUrlCounter = new Counter("counter_API_fetchSeoUrl");

export default function () {
  fetchSeoUrlViaStoreApi(APIFetchSeoUrlRT, APIFetchSeoUrlCounter);
}
