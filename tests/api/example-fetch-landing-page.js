import { Counter, Trend } from "k6/metrics";
import { fetchLandingPageViaStoreApi } from "../../helpers/api.js";

const APIFetchLandingPageRT = new Trend("response_time_API_fetchLandingPage");
const APIFetchLandingPageCounter = new Counter(
  "counter_API_fetchLandingPage"
);

const landingPageId = __ENV.LANDING_PAGE_ID || "";

export default function () {
  if (!landingPageId) {
    console.log(
      "Skipping landing page test: set LANDING_PAGE_ID env variable"
    );
    return;
  }

  fetchLandingPageViaStoreApi(
    APIFetchLandingPageRT,
    APIFetchLandingPageCounter,
    landingPageId
  );
}
