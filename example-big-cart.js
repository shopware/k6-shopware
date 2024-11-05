import {
  accountRegister,
  addProductToCart,
  placeOrder,
  visitCartPage,
  visitConfirmPage,
  visitProductDetailPage,
  visitStorefront,
} from "./helpers/storefront.js";

export default function () {
  visitStorefront();
  accountRegister();
  // add 10 products to cart
  for (let i = 0; i < 10; i++) {
    addProductToCart(visitProductDetailPage().id);
  }
  visitCartPage();
  visitConfirmPage();
  placeOrder();
}
