import { Counter, Trend } from "k6/metrics";
import { fetchNavigationAndCategoriesViaStoreApi } from "../../helpers/store-api/fetch-navigation.js";

const APINavigationRT = new Trend("response_time_API_navigation");
const APINavigationCounter = new Counter("counter_API_navigation");

const APICategoryFromNavRT = new Trend(
  "response_time_API_category_from_navigation"
);
const APICategoryFromNavCounter = new Counter(
  "counter_API_category_from_navigation"
);

export default function () {
  fetchNavigationAndCategoriesViaStoreApi(
    APINavigationRT,
    APINavigationCounter,
    APICategoryFromNavRT,
    APICategoryFromNavCounter
  );
}
