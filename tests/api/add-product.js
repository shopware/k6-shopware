import { Counter, Trend } from "k6/metrics";
import { addProductToCartViaStoreApi } from "../../helpers/store-api/add-product-to-cart.js";

const APIAddProductRT = new Trend("response_time_API_addProduct");
const APIAddProductCounter = new Counter("counter_API_addProduct");

const productQuantity = Number(__ENV.PRODUCT_QUANTITY || 1);

export default function () {
  addProductToCartViaStoreApi(
    APIAddProductRT,
    APIAddProductCounter,
    productQuantity
  );
}
