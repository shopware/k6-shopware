import { Counter, Trend } from "k6/metrics";
import { fetchShippingMethodsViaStoreApi } from "../../helpers/store-api/fetch-shipping-methods.js";

const APIFetchShippingMethodsRT = new Trend(
  "response_time_API_fetchShippingMethods"
);
const APIFetchShippingMethodsCounter = new Counter(
  "counter_API_fetchShippingMethods"
);

export default function () {
  fetchShippingMethodsViaStoreApi(
    APIFetchShippingMethodsRT,
    APIFetchShippingMethodsCounter
  );
}
