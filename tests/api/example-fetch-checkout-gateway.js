import { Counter, Trend } from "k6/metrics";
import { fetchCheckoutGatewayViaStoreApi } from "../../helpers/store-api/fetch-checkout-gateway.js";

const APIFetchCheckoutGatewayRT = new Trend(
  "response_time_API_fetchCheckoutGateway"
);
const APIFetchCheckoutGatewayCounter = new Counter(
  "counter_API_fetchCheckoutGateway"
);

export default function () {
  fetchCheckoutGatewayViaStoreApi(
    APIFetchCheckoutGatewayRT,
    APIFetchCheckoutGatewayCounter
  );
}
