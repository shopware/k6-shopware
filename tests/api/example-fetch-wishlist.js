import { Counter, Trend } from "k6/metrics";
import { fetchWishlistViaStoreApi } from "../../helpers/store-api/fetch-wishlist.js";

const APIFetchWishlistRT = new Trend("response_time_API_fetchWishlist");
const APIFetchWishlistCounter = new Counter("counter_API_fetchWishlist");

export default function () {
  fetchWishlistViaStoreApi(APIFetchWishlistRT, APIFetchWishlistCounter);
}
