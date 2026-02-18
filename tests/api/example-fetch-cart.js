import { Counter, Trend } from "k6/metrics";
import { fetchCartViaStoreApi } from "../../helpers/api.js";

const APIFetchCartRT = new Trend("response_time_API_fetchCart");
const APIFetchCartCounter = new Counter("counter_API_fetchCart");

export default function () {
  fetchCartViaStoreApi(APIFetchCartRT, APIFetchCartCounter);
}
