import { Counter, Trend } from "k6/metrics";
import { fetchInfoRoutesViaStoreApi } from "../../helpers/store-api/fetch-info-routes.js";

const APIFetchInfoRoutesRT = new Trend("response_time_API_fetchInfoRoutes");
const APIFetchInfoRoutesCounter = new Counter("counter_API_fetchInfoRoutes");

export default function () {
  fetchInfoRoutesViaStoreApi(APIFetchInfoRoutesRT, APIFetchInfoRoutesCounter);
}
