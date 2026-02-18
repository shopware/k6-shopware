import { Counter, Trend } from "k6/metrics";
import { deleteFromWishlistViaStoreApi } from "../../helpers/api.js";

const APIDeleteFromWishlistRT = new Trend(
  "response_time_API_deleteFromWishlist"
);
const APIDeleteFromWishlistCounter = new Counter(
  "counter_API_deleteFromWishlist"
);

export default function () {
  deleteFromWishlistViaStoreApi(
    APIDeleteFromWishlistRT,
    APIDeleteFromWishlistCounter
  );
}
