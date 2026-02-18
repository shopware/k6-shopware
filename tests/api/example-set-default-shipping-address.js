import { Counter, Trend } from "k6/metrics";
import { setDefaultShippingAddressViaStoreApi } from "../../helpers/api.js";

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
