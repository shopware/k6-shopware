import { Counter, Trend } from "k6/metrics";
import { listAddressesViaStoreApi } from "../../helpers/store-api/list-addresses.js";

const APIListAddressesRT = new Trend("response_time_API_listAddresses");
const APIListAddressesCounter = new Counter("counter_API_listAddresses");

export default function () {
  listAddressesViaStoreApi(APIListAddressesRT, APIListAddressesCounter);
}
