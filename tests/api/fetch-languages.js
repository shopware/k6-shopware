import { Counter, Trend } from "k6/metrics";
import { fetchLanguagesViaStoreApi } from "../../helpers/store-api/fetch-languages.js";

const APIFetchLanguagesRT = new Trend("response_time_API_fetchLanguages");
const APIFetchLanguagesCounter = new Counter("counter_API_fetchLanguages");

export default function () {
  fetchLanguagesViaStoreApi(APIFetchLanguagesRT, APIFetchLanguagesCounter);
}
