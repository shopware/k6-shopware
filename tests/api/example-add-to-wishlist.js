import { Counter, Trend } from "k6/metrics";
import { addToWishlistViaStoreApi } from "../../helpers/store-api/add-to-wishlist.js";

const APIAddToWishlistRT = new Trend("response_time_API_addToWishlist");
const APIAddToWishlistCounter = new Counter("counter_API_addToWishlist");

export default function () {
  addToWishlistViaStoreApi(APIAddToWishlistRT, APIAddToWishlistCounter);
}
