import { check } from "k6";
import http from "k6/http";
import {
  media,
  salesChannel,
  seoListingPage,
  seoProductDetailPage,
} from "./data.js";
import { between, getRandomItem } from "./util.js";

export { registerNewUserViaStoreApi } from "./store-api/register-user.js";
export { loginUserViaStoreApi } from "./store-api/login-user.js";
export { addProductToCartViaStoreApi } from "./store-api/add-product-to-cart.js";
export { createGuestOrderViaStoreApi } from "./store-api/create-guest-order.js";
export { fetchCategoryViaStoreApi } from "./store-api/fetch-category.js";
export { addUserAddressViaStoreApi } from "./store-api/add-user-address.js";
export {
  fetchMainNavigationViaStoreApi,
  fetchNavigationAndCategoriesViaStoreApi,
} from "./store-api/fetch-navigation.js";
export { fetchPaymentMethodsViaStoreApi } from "./store-api/fetch-payment-methods.js";
export { fetchCartViaStoreApi } from "./store-api/fetch-cart.js";
export { deleteCartLineItemViaStoreApi } from "./store-api/delete-cart-line-item.js";
export { fetchProductsViaStoreApi } from "./store-api/fetch-products.js";
export { fetchProductDetailViaStoreApi } from "./store-api/fetch-product-detail.js";
export { fetchProductListingViaStoreApi } from "./store-api/fetch-product-listing.js";
export { searchProductsViaStoreApi } from "./store-api/search-products.js";
export { searchSuggestViaStoreApi } from "./store-api/search-suggest.js";
export { fetchOrdersViaStoreApi } from "./store-api/fetch-orders.js";
export { fetchShippingMethodsViaStoreApi } from "./store-api/fetch-shipping-methods.js";
export { fetchCustomerViaStoreApi } from "./store-api/fetch-customer.js";
export { fetchCmsPageViaStoreApi } from "./store-api/fetch-cms-page.js";
export { fetchWishlistViaStoreApi } from "./store-api/fetch-wishlist.js";
export { addToWishlistViaStoreApi } from "./store-api/add-to-wishlist.js";
export { deleteFromWishlistViaStoreApi } from "./store-api/delete-from-wishlist.js";
export { fetchCountriesViaStoreApi } from "./store-api/fetch-countries.js";
export { fetchCountryStatesViaStoreApi } from "./store-api/fetch-country-states.js";
export { fetchCurrenciesViaStoreApi } from "./store-api/fetch-currencies.js";
export { fetchLanguagesViaStoreApi } from "./store-api/fetch-languages.js";
export { fetchSalutationsViaStoreApi } from "./store-api/fetch-salutations.js";
export { changeProfileViaStoreApi } from "./store-api/change-profile.js";
export { listAddressesViaStoreApi } from "./store-api/list-addresses.js";
export { logoutUserViaStoreApi } from "./store-api/logout-user.js";
export { setDefaultBillingAddressViaStoreApi } from "./store-api/set-default-billing-address.js";
export { setDefaultShippingAddressViaStoreApi } from "./store-api/set-default-shipping-address.js";
export { fetchCheckoutGatewayViaStoreApi } from "./store-api/fetch-checkout-gateway.js";
export { cancelOrderViaStoreApi } from "./store-api/cancel-order.js";
export { handleOrderPaymentViaStoreApi } from "./store-api/handle-order-payment.js";
export { fetchInfoRoutesViaStoreApi } from "./store-api/fetch-info-routes.js";
export { fetchBreadcrumbViaStoreApi } from "./store-api/fetch-breadcrumb.js";
export { fetchLandingPageViaStoreApi } from "./store-api/fetch-landing-page.js";
export { fetchSeoUrlViaStoreApi } from "./store-api/fetch-seo-url.js";
export { fetchSitemapViaStoreApi } from "./store-api/fetch-sitemap.js";
export { fetchCookieGroupsViaStoreApi } from "./store-api/fetch-cookie-groups.js";
export { fetchCategoriesViaStoreApi } from "./store-api/fetch-categories.js";

function uuidv4() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let credentials = {};

/**
 * @returns {{access_token: string, expires_in: number, token_type: string}}
 */
export function fetchBearerToken(trend, counter) {
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].api.baseURL}/oauth/token`,
    JSON.stringify(salesChannel[0].api.credentials),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  return resp.json();
}

/**
 * @param {{access_token: string, expires_in: number, token_type: string}} creds
 */
export function useCredentials(creds) {
  credentials = creds;
}

/**
 * @param {number} count
 */
export function productImport(trend, counter, count = 20) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const product = {
      name: `Product ${i}`,
      description: `Description of product ${i}`,
      productNumber: uuidv4(),
      active: true,
      price: [
        {
          currencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
          gross: between(100, 1000),
          net: between(100, 1000),
          linked: false,
        },
      ],
      visibilities: [
        {
          salesChannelId: salesChannel[0].id,
          visibility: 30,
        },
      ],
      categories: [
        {
          id: getRandomItem(seoListingPage).id,
        },
      ],
      media: [
        {
          mediaId: getRandomItem(media),
        },
      ],
      taxId: getRandomItem(salesChannel[0].taxIds),
      stock: between(1, 500),
      isCloseout: false,
    };

    products.push(product);
  }

  const payload = [
    {
      key: "product-import",
      action: "upsert",
      entity: "product",
      payload: products,
    },
  ];

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].api.baseURL}/_action/sync`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.access_token}`,
        "indexing-behavior": "use-queue-indexing",
      },
      tags: {
        name: "api.product.import",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  if (resp.status === 400) {
    console.log(`Product import failed: ${resp.body}`);
  }

  check(resp, {
    "Import products is successful": (r) => r.status === 200,
  });
}

export function productChangeStocks(trend, counter, count = 20) {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      id: getRandomItem(seoProductDetailPage).id,
      stock: between(1, 500),
    });
  }

  const payload = [
    {
      key: "product-stock-update",
      action: "upsert",
      entity: "product",
      payload: products,
    },
  ];

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].api.baseURL}/_action/sync`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.access_token}`,
        "indexing-behavior": "use-queue-indexing",
      },
      tags: {
        name: "api.product.stock_update",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  if (resp.status === 400) {
    console.log(`Stock update failed: ${resp.body}`);
  }

  check(resp, {
    "Product stock update is successful": (r) => r.status === 200,
  });
}

export function productChangePrice(trend, counter, count = 20) {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      id: getRandomItem(seoProductDetailPage).id,
      price: [
        {
          currencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
          gross: between(100, 1000),
          net: between(100, 1000),
          linked: false,
        },
      ],
    });
  }

  const payload = [
    {
      key: "product-price-update",
      action: "upsert",
      entity: "product",
      payload: products,
    },
  ];

  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].api.baseURL}/_action/sync`,
    JSON.stringify(payload),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${credentials.access_token}`,
        "indexing-behavior": "use-queue-indexing",
      },
      tags: {
        name: "api.product.price_update",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  if (resp.status === 400) {
    console.log(`Price update failed: ${resp.body}`);
  }

  check(resp, {
    "Product price update is successful": (r) => r.status === 200,
  });
}
