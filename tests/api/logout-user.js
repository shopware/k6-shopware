import { Counter, Trend } from "k6/metrics";
import { logoutUserViaStoreApi } from "../../helpers/store-api/logout-user.js";

const APILogoutUserRT = new Trend("response_time_API_logoutUser");
const APILogoutUserCounter = new Counter("counter_API_logoutUser");

export default function () {
  logoutUserViaStoreApi(APILogoutUserRT, APILogoutUserCounter);
}
