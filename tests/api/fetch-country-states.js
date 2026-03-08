import { Counter, Trend } from "k6/metrics";
import { fetchCountryStatesViaStoreApi } from "../../helpers/store-api/fetch-country-states.js";

const APIFetchCountryStatesRT = new Trend(
  "response_time_API_fetchCountryStates"
);
const APIFetchCountryStatesCounter = new Counter(
  "counter_API_fetchCountryStates"
);

export default function () {
  fetchCountryStatesViaStoreApi(
    APIFetchCountryStatesRT,
    APIFetchCountryStatesCounter
  );
}
