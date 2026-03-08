import { Counter, Trend } from "k6/metrics";
import { fetchCookieGroupsViaStoreApi } from "../../helpers/store-api/fetch-cookie-groups.js";

const APIFetchCookieGroupsRT = new Trend(
  "response_time_API_fetchCookieGroups"
);
const APIFetchCookieGroupsCounter = new Counter(
  "counter_API_fetchCookieGroups"
);

export default function () {
  fetchCookieGroupsViaStoreApi(
    APIFetchCookieGroupsRT,
    APIFetchCookieGroupsCounter
  );
}
