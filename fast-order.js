import {
  accountRegister,
  addProductToCart,
  placeOrder,
  visitCartPage,
  visitConfirmPage,
  visitNavigationPage,
  visitProductDetailPage,
  visitSearchPage,
  visitStorefront,
} from "./helpers/storefront.js";

export default function () {
  visitStorefront();
  accountRegister();
  addProductToCart(visitProductDetailPage().id);
  visitCartPage();
  visitConfirmPage();
  placeOrder();
}
