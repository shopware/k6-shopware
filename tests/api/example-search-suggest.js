import { Counter, Trend } from "k6/metrics";
import { searchSuggestViaStoreApi } from "../../helpers/api.js";

const APISearchSuggestRT = new Trend("response_time_API_searchSuggest");
const APISearchSuggestCounter = new Counter("counter_API_searchSuggest");

export default function () {
  searchSuggestViaStoreApi(APISearchSuggestRT, APISearchSuggestCounter);
}
