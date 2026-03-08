import { Counter, Trend } from "k6/metrics";
import { deleteCartLineItemViaStoreApi } from "../../helpers/store-api/delete-cart-line-item.js";

const APIDeleteCartLineItemRT = new Trend(
  "response_time_API_deleteCartLineItem"
);
const APIDeleteCartLineItemCounter = new Counter(
  "counter_API_deleteCartLineItem"
);

export default function () {
  deleteCartLineItemViaStoreApi(
    APIDeleteCartLineItemRT,
    APIDeleteCartLineItemCounter
  );
}
