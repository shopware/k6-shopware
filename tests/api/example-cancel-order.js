import { Counter, Trend } from "k6/metrics";
import { cancelOrderViaStoreApi } from "../../helpers/store-api/cancel-order.js";

const APICancelOrderRT = new Trend("response_time_API_cancelOrder");
const APICancelOrderCounter = new Counter("counter_API_cancelOrder");

export default function () {
  cancelOrderViaStoreApi(APICancelOrderRT, APICancelOrderCounter);
}
