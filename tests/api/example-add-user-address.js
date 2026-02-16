import { Counter, Trend } from "k6/metrics";
import { addUserAddressViaStoreApi } from "../../helpers/api.js";

const APIAddUserAddressRT = new Trend("response_time_API_addUserAddress");
const APIAddUserAddressCounter = new Counter("counter_API_addUserAddress");

export default function () {
  addUserAddressViaStoreApi(APIAddUserAddressRT, APIAddUserAddressCounter);
}
