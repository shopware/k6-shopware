import { Counter, Trend } from "k6/metrics";
import { registerNewUserViaStoreApi } from "../../helpers/api.js";

const APIRegisterUserRT = new Trend("response_time_API_registerUser");
const APIRegisterUserCounter = new Counter("counter_API_registerUser");

export default function () {
  registerNewUserViaStoreApi(APIRegisterUserRT, APIRegisterUserCounter);
}
