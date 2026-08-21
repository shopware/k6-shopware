import { Counter, Trend } from "k6/metrics";
import { fetchOrdersViaStoreApi } from "../../helpers/store-api/fetch-orders.js";

const APIFetchOrdersRT = new Trend("response_time_API_fetchOrders");
const APIFetchOrdersCounter = new Counter("counter_API_fetchOrders");

export default function () {
  fetchOrdersViaStoreApi(APIFetchOrdersRT, APIFetchOrdersCounter);
}
