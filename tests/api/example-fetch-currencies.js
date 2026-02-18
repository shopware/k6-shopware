import { Counter, Trend } from "k6/metrics";
import { fetchCurrenciesViaStoreApi } from "../../helpers/api.js";

const APIFetchCurrenciesRT = new Trend("response_time_API_fetchCurrencies");
const APIFetchCurrenciesCounter = new Counter("counter_API_fetchCurrencies");

export default function () {
  fetchCurrenciesViaStoreApi(APIFetchCurrenciesRT, APIFetchCurrenciesCounter);
}
