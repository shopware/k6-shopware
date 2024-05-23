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
  visitSearchPage();
  visitNavigationPage();
  accountRegister();
  visitNavigationPage();
  addProductToCart(visitProductDetailPage().id);
  visitNavigationPage();
  visitNavigationPage();
  addProductToCart(visitProductDetailPage().id);
  visitNavigationPage();
  visitNavigationPage();
  addProductToCart(visitProductDetailPage().id);
  visitCartPage();
  visitConfirmPage();
  placeOrder();
}
