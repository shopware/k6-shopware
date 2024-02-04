import {
  accountRegister,
  addProductToCart,
  placeOrder,
  visitCartPage,
  visitConfirmPage,
  visitProductDetailPage,
  visitSearchPage,
  visitStorefront,
} from "./helpers/storefront.js";

export default function () {
  visitStorefront();
  visitSearchPage();
  accountRegister();
  const page = visitProductDetailPage();
  addProductToCart(page.id);
  visitCartPage();
  visitConfirmPage();
  placeOrder();
}
