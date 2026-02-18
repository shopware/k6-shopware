import { Counter, Trend } from "k6/metrics";
import { setDefaultBillingAddressViaStoreApi } from "../../helpers/api.js";

const APISetDefaultBillingRT = new Trend(
  "response_time_API_setDefaultBillingAddress"
);
const APISetDefaultBillingCounter = new Counter(
  "counter_API_setDefaultBillingAddress"
);

export default function () {
  setDefaultBillingAddressViaStoreApi(
    APISetDefaultBillingRT,
    APISetDefaultBillingCounter
  );
}
