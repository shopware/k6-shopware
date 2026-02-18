import { Counter, Trend } from "k6/metrics";
import { changeProfileViaStoreApi } from "../../helpers/api.js";

const APIChangeProfileRT = new Trend("response_time_API_changeProfile");
const APIChangeProfileCounter = new Counter("counter_API_changeProfile");

export default function () {
  changeProfileViaStoreApi(APIChangeProfileRT, APIChangeProfileCounter);
}
