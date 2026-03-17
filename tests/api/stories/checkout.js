import { Counter, Trend } from "k6/metrics";
import { checkoutStoryViaStoreApi } from "../../../helpers/store-api/checkout-story.js";
import { parseProductQuantity } from "../../../helpers/store-api/utils.js";

const contextRT = new Trend("response_time_checkout_context");
const contextCounter = new Counter("counter_checkout_context");

const registerRT = new Trend("response_time_checkout_register");
const registerCounter = new Counter("counter_checkout_register");

const fetchProductsRT = new Trend("response_time_checkout_fetchProducts");
const fetchProductsCounter = new Counter("counter_checkout_fetchProducts");

const addToCartRT = new Trend("response_time_checkout_addToCart");
const addToCartCounter = new Counter("counter_checkout_addToCart");

const fetchCartRT = new Trend("response_time_checkout_fetchCart");
const fetchCartCounter = new Counter("counter_checkout_fetchCart");

const fetchShippingMethodsRT = new Trend(
  "response_time_checkout_fetchShippingMethods"
);
const fetchShippingMethodsCounter = new Counter(
  "counter_checkout_fetchShippingMethods"
);

const fetchPaymentMethodsRT = new Trend(
  "response_time_checkout_fetchPaymentMethods"
);
const fetchPaymentMethodsCounter = new Counter(
  "counter_checkout_fetchPaymentMethods"
);

const fetchCheckoutGatewayRT = new Trend(
  "response_time_checkout_fetchCheckoutGateway"
);
const fetchCheckoutGatewayCounter = new Counter(
  "counter_checkout_fetchCheckoutGateway"
);

const placeOrderRT = new Trend("response_time_checkout_placeOrder");
const placeOrderCounter = new Counter("counter_checkout_placeOrder");

const productQuantity = parseProductQuantity(__ENV.PRODUCT_QUANTITY);

export default function () {
  checkoutStoryViaStoreApi(
    {
      context: { trend: contextRT, counter: contextCounter },
      register: { trend: registerRT, counter: registerCounter },
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
