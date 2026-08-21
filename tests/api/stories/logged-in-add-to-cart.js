import { Counter, Trend } from "k6/metrics";
import { loggedInAddToCartStoryViaStoreApi } from "../../../helpers/store-api/logged-in-add-to-cart-story.js";
import { parseProductQuantity } from "../../../helpers/store-api/utils.js";

const contextRT = new Trend("response_time_logged_in_cart_context");
const contextCounter = new Counter("counter_logged_in_cart_context");

const registerRT = new Trend("response_time_logged_in_cart_register");
const registerCounter = new Counter("counter_logged_in_cart_register");

const loginRT = new Trend("response_time_logged_in_cart_login");
const loginCounter = new Counter("counter_logged_in_cart_login");

const fetchProductsRT = new Trend("response_time_logged_in_cart_fetchProducts");
const fetchProductsCounter = new Counter(
  "counter_logged_in_cart_fetchProducts"
);

const addToCartRT = new Trend("response_time_logged_in_cart_addToCart");
const addToCartCounter = new Counter("counter_logged_in_cart_addToCart");

const fetchCartRT = new Trend("response_time_logged_in_cart_fetchCart");
const fetchCartCounter = new Counter("counter_logged_in_cart_fetchCart");

const productQuantity = parseProductQuantity(__ENV.PRODUCT_QUANTITY);

export default function () {
  loggedInAddToCartStoryViaStoreApi(
    {
      context: { trend: contextRT, counter: contextCounter },
      register: { trend: registerRT, counter: registerCounter },
      login: { trend: loginRT, counter: loginCounter },
      fetchProducts: { trend: fetchProductsRT, counter: fetchProductsCounter },
      addToCart: { trend: addToCartRT, counter: addToCartCounter },
      fetchCart: { trend: fetchCartRT, counter: fetchCartCounter },
    },
    productQuantity
  );
}
