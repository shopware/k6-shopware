import { Counter, Trend } from "k6/metrics";
import { fetchBreadcrumbViaStoreApi } from "../../helpers/api.js";

const APIFetchBreadcrumbRT = new Trend("response_time_API_fetchBreadcrumb");
const APIFetchBreadcrumbCounter = new Counter("counter_API_fetchBreadcrumb");

export default function () {
  fetchBreadcrumbViaStoreApi(APIFetchBreadcrumbRT, APIFetchBreadcrumbCounter);
}
