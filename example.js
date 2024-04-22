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
  visitSearchPage();
  visitNavigationPage();
  visitNavigationPage();
  addProductToCart(visitProductDetailPage().id);
  addProductToCart(visitProductDetailPage().id);
  addProductToCart(visitProductDetailPage().id);
  visitCartPage();
  visitConfirmPage();
  placeOrder();
}
