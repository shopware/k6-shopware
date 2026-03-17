import { Counter, Trend } from "k6/metrics";
import { fetchCustomerViaStoreApi } from "../../helpers/store-api/fetch-customer.js";

const APIFetchCustomerRT = new Trend("response_time_API_fetchCustomer");
const APIFetchCustomerCounter = new Counter("counter_API_fetchCustomer");

export default function () {
  fetchCustomerViaStoreApi(APIFetchCustomerRT, APIFetchCustomerCounter);
}
