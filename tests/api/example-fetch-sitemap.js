import { Counter, Trend } from "k6/metrics";
import { fetchSitemapViaStoreApi } from "../../helpers/api.js";

const APIFetchSitemapRT = new Trend("response_time_API_fetchSitemap");
const APIFetchSitemapCounter = new Counter("counter_API_fetchSitemap");

export default function () {
  fetchSitemapViaStoreApi(APIFetchSitemapRT, APIFetchSitemapCounter);
}
