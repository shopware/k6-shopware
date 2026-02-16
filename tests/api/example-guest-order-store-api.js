import { Counter, Trend } from "k6/metrics";
import { createGuestOrderViaStoreApi } from "../../helpers/api.js";

const APIGuestOrderRT = new Trend("response_time_API_guestOrder_storeApi");
const APIGuestOrderCounter = new Counter("counter_API_guestOrder_storeApi");

const productQuantity = Number(__ENV.PRODUCT_QUANTITY || 1);

export default function () {
  createGuestOrderViaStoreApi(
    APIGuestOrderRT,
    APIGuestOrderCounter,
    productQuantity
  );
}
