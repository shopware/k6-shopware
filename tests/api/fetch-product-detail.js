import { Counter, Trend } from "k6/metrics";
import { fetchProductDetailViaStoreApi } from "../../helpers/store-api/fetch-product-detail.js";

const APIFetchProductDetailRT = new Trend(
  "response_time_API_fetchProductDetail"
);
const APIFetchProductDetailCounter = new Counter(
  "counter_API_fetchProductDetail"
);

export default function () {
  fetchProductDetailViaStoreApi(
    APIFetchProductDetailRT,
    APIFetchProductDetailCounter
  );
}
