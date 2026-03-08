import { Counter, Trend } from "k6/metrics";
import { fetchPaymentMethodsViaStoreApi } from "../../helpers/store-api/fetch-payment-methods.js";

const APIFetchPaymentMethodsRT = new Trend(
  "response_time_API_fetchPaymentMethods"
);
const APIFetchPaymentMethodsCounter = new Counter(
  "counter_API_fetchPaymentMethods"
);

export default function () {
  fetchPaymentMethodsViaStoreApi(
    APIFetchPaymentMethodsRT,
    APIFetchPaymentMethodsCounter
  );
}
