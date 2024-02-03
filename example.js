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
  const page = visitProductDetailPage();
  addProductToCart(page.id);
  visitCartPage();
  visitConfirmPage();
  console.log(placeOrder());
}
