import {
  guestRegister,
  addProductToCart,
  placeOrder,
  visitCartPage,
  visitConfirmPage,
  visitProductDetailPage,
  visitStorefront,
} from "./helpers/storefront.js";

export default function () {
  visitStorefront();
  guestRegister();
  addProductToCart(visitProductDetailPage().id);
  visitCartPage();
  visitConfirmPage();
  placeOrder();
}
