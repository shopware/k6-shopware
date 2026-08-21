import { Counter, Trend } from "k6/metrics";
import { addUserAddressViaStoreApi } from "../../helpers/store-api/add-user-address.js";

const APIAddUserAddressRT = new Trend("response_time_API_addUserAddress");
const APIAddUserAddressCounter = new Counter("counter_API_addUserAddress");

export default function () {
  addUserAddressViaStoreApi(APIAddUserAddressRT, APIAddUserAddressCounter);
}
