import { Counter, Trend } from "k6/metrics";
import {
  loginUserViaStoreApi,
  registerNewUserViaStoreApi,
} from "../../helpers/api.js";

const APIRegisterUserRT = new Trend("response_time_API_registerUser_forLogin");
const APIRegisterUserCounter = new Counter("counter_API_registerUser_forLogin");

const APILoginUserRT = new Trend("response_time_API_loginUser");
const APILoginUserCounter = new Counter("counter_API_loginUser");

export default function () {
  const registrationResult = registerNewUserViaStoreApi(
    APIRegisterUserRT,
    APIRegisterUserCounter
  );

  loginUserViaStoreApi(
    APILoginUserRT,
    APILoginUserCounter,
    registrationResult.email
  );
}
