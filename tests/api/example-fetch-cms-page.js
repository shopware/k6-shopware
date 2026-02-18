import { Counter, Trend } from "k6/metrics";
import { fetchCmsPageViaStoreApi } from "../../helpers/api.js";

const APIFetchCmsPageRT = new Trend("response_time_API_fetchCmsPage");
const APIFetchCmsPageCounter = new Counter("counter_API_fetchCmsPage");

export default function () {
  fetchCmsPageViaStoreApi(APIFetchCmsPageRT, APIFetchCmsPageCounter);
}
