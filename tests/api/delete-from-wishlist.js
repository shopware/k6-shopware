import { Counter, Trend } from "k6/metrics";
import { deleteFromWishlistViaStoreApi } from "../../helpers/store-api/delete-from-wishlist.js";

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
