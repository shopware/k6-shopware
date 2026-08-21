import { Counter, Trend } from "k6/metrics";
import { setDefaultShippingAddressViaStoreApi } from "../../helpers/store-api/set-default-shipping-address.js";

const APISetDefaultShippingRT = new Trend(
  "response_time_API_setDefaultShippingAddress"
);
const APISetDefaultShippingCounter = new Counter(
  "counter_API_setDefaultShippingAddress"
);

export default function () {
  setDefaultShippingAddressViaStoreApi(
    APISetDefaultShippingRT,
    APISetDefaultShippingCounter
  );
}
