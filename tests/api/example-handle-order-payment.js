import { Counter, Trend } from "k6/metrics";
import { handleOrderPaymentViaStoreApi } from "../../helpers/store-api/handle-order-payment.js";

const APIHandleOrderPaymentRT = new Trend(
  "response_time_API_handleOrderPayment"
);
const APIHandleOrderPaymentCounter = new Counter(
  "counter_API_handleOrderPayment"
);

export default function () {
  handleOrderPaymentViaStoreApi(
    APIHandleOrderPaymentRT,
    APIHandleOrderPaymentCounter
  );
}
