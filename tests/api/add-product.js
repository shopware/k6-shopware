import { Counter, Trend } from "k6/metrics";
import { addProductToCartViaStoreApi } from "../../helpers/store-api/add-product-to-cart.js";
import { parseProductQuantity } from "../../helpers/store-api/utils.js";

const APIAddProductRT = new Trend("response_time_API_addProduct");
const APIAddProductCounter = new Counter("counter_API_addProduct");

const productQuantity = parseProductQuantity(__ENV.PRODUCT_QUANTITY);

export default function () {
  addProductToCartViaStoreApi(
    APIAddProductRT,
    APIAddProductCounter,
    productQuantity
  );
}
