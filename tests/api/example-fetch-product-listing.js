import { Counter, Trend } from "k6/metrics";
import { fetchProductListingViaStoreApi } from "../../helpers/api.js";

const APIFetchProductListingRT = new Trend(
  "response_time_API_fetchProductListing"
);
const APIFetchProductListingCounter = new Counter(
  "counter_API_fetchProductListing"
);

export default function () {
  fetchProductListingViaStoreApi(
    APIFetchProductListingRT,
    APIFetchProductListingCounter
  );
}
