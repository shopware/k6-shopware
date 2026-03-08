import { Counter, Trend } from "k6/metrics";
import { loggedInCheckoutStoryViaStoreApi } from "../../../helpers/store-api/logged-in-checkout-story.js";

const contextRT = new Trend("response_time_logged_in_checkout_context");
const contextCounter = new Counter("counter_logged_in_checkout_context");

const registerRT = new Trend("response_time_logged_in_checkout_register");
const registerCounter = new Counter("counter_logged_in_checkout_register");

const loginRT = new Trend("response_time_logged_in_checkout_login");
const loginCounter = new Counter("counter_logged_in_checkout_login");

const fetchProductsRT = new Trend(
  "response_time_logged_in_checkout_fetchProducts"
);
const fetchProductsCounter = new Counter(
  "counter_logged_in_checkout_fetchProducts"
);

const addToCartRT = new Trend("response_time_logged_in_checkout_addToCart");
const addToCartCounter = new Counter("counter_logged_in_checkout_addToCart");

const fetchCartRT = new Trend("response_time_logged_in_checkout_fetchCart");
const fetchCartCounter = new Counter("counter_logged_in_checkout_fetchCart");

const fetchShippingMethodsRT = new Trend(
  "response_time_logged_in_checkout_fetchShippingMethods"
);
const fetchShippingMethodsCounter = new Counter(
  "counter_logged_in_checkout_fetchShippingMethods"
);

const fetchPaymentMethodsRT = new Trend(
  "response_time_logged_in_checkout_fetchPaymentMethods"
);
const fetchPaymentMethodsCounter = new Counter(
  "counter_logged_in_checkout_fetchPaymentMethods"
);

const fetchCheckoutGatewayRT = new Trend(
  "response_time_logged_in_checkout_fetchCheckoutGateway"
);
const fetchCheckoutGatewayCounter = new Counter(
  "counter_logged_in_checkout_fetchCheckoutGateway"
);

const placeOrderRT = new Trend("response_time_logged_in_checkout_placeOrder");
const placeOrderCounter = new Counter(
  "counter_logged_in_checkout_placeOrder"
);

const productQuantity = Number(__ENV.PRODUCT_QUANTITY || 1);

export default function () {
  loggedInCheckoutStoryViaStoreApi(
    {
      context: { trend: contextRT, counter: contextCounter },
      register: { trend: registerRT, counter: registerCounter },
      login: { trend: loginRT, counter: loginCounter },
      fetchProducts: { trend: fetchProductsRT, counter: fetchProductsCounter },
      addToCart: { trend: addToCartRT, counter: addToCartCounter },
      fetchCart: { trend: fetchCartRT, counter: fetchCartCounter },
      fetchShippingMethods: {
        trend: fetchShippingMethodsRT,
        counter: fetchShippingMethodsCounter,
      },
      fetchPaymentMethods: {
        trend: fetchPaymentMethodsRT,
        counter: fetchPaymentMethodsCounter,
      },
      fetchCheckoutGateway: {
        trend: fetchCheckoutGatewayRT,
        counter: fetchCheckoutGatewayCounter,
      },
      placeOrder: { trend: placeOrderRT, counter: placeOrderCounter },
    },
    productQuantity
  );
}
