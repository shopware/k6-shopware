import { Counter, Trend } from "k6/metrics";
import { fetchSalutationsViaStoreApi } from "../../helpers/store-api/fetch-salutations.js";

const APIFetchSalutationsRT = new Trend("response_time_API_fetchSalutations");
const APIFetchSalutationsCounter = new Counter(
  "counter_API_fetchSalutations"
);

export default function () {
  fetchSalutationsViaStoreApi(
    APIFetchSalutationsRT,
    APIFetchSalutationsCounter
  );
}
