import { Counter, Trend } from "k6/metrics";
import { fetchCountriesViaStoreApi } from "../../helpers/api.js";

const APIFetchCountriesRT = new Trend("response_time_API_fetchCountries");
const APIFetchCountriesCounter = new Counter("counter_API_fetchCountries");

export default function () {
  fetchCountriesViaStoreApi(APIFetchCountriesRT, APIFetchCountriesCounter);
}
