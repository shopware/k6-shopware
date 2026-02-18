# Grafana K6 with Shopware

This repository contains helpers and an example scenario to run K6 against a Shopware Shop.

> [!NOTE]  
> Headless use-cases are right now not implemented

## Requirements

- Bun
- K6

## Usage

Create an `.env` file with your Shopware Shop Credentials. See `.env.example` for reference.

First install the npm packages `bun install`

Run `bun run fetch-fixtures.ts` to fetch seo-urls, the sales channel from external.

Run `k6 run example.js` to run the example scenario.
The example scenario will create a new customer, add a product to the cart and checkout the cart.

You can adjust with `-u USERS --iterations ITERATORS` how often this and parallel this scenario should run.

## Store API Tests

Standalone k6 tests that benchmark individual Shopware 6 Store API endpoints. Each test can be run independently.

### Running a test

```bash
k6 run tests/api/<test-file>.js
```

With custom virtual users and duration:

```bash
k6 run --vus 10 --duration 30s tests/api/example-register-user.js
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `PRODUCT_COUNT` | `1` | Number of products to add to the cart. Used by `example-add-product.js` |
| `PRODUCT_QUANTITY` | `1` | Quantity per product in the cart. Used by `example-guest-order-store-api.js` |
| `LANDING_PAGE_ID` | _(none)_ | Landing page ID. Required by `example-fetch-landing-page.js` |

### Available tests

| Test file | Description |
|---|---|
| `example-register-user.js` | Registers a new user account via the `account/register` endpoint. |
| `example-login-user.js` | Registers a new user and then logs in via the `account/login` endpoint. |
| `example-logout-user.js` | Registers a user and logs out via the `account/logout` endpoint. |
| `example-fetch-customer.js` | Registers a user and fetches the customer profile via `account/customer`. |
| `example-change-profile.js` | Registers a user and updates their profile via `account/change-profile`. |
| `example-list-addresses.js` | Registers a user and lists their addresses via `account/list-address`. |
| `example-add-user-address.js` | Creates a context, registers a user, and adds a new address via the `account/address` endpoint. |
| `example-set-default-billing-address.js` | Registers a user, adds an address, and sets it as default billing address. |
| `example-set-default-shipping-address.js` | Registers a user, adds an address, and sets it as default shipping address. |
| `example-add-product.js` | Adds a random product to the cart via the `checkout/cart/line-item` endpoint. Supports `PRODUCT_COUNT` env variable. |
| `example-fetch-cart.js` | Creates a context and fetches the current cart via `checkout/cart`. |
| `example-delete-cart-line-item.js` | Adds a product to cart then removes it via `checkout/cart/line-item/delete`. |
| `example-fetch-checkout-gateway.js` | Creates a context and fetches checkout gateway options via `checkout/gateway`. |
| `example-guest-order-store-api.js` | Full guest checkout flow: creates context, adds product to cart, registers as guest, and places an order. Supports `PRODUCT_QUANTITY` env variable. |
| `example-fetch-orders.js` | Places an order then lists customer orders via the `order` endpoint. |
| `example-cancel-order.js` | Places an order and cancels it via `order/state/cancel`. |
| `example-handle-order-payment.js` | Places an order and triggers payment handling via `order/payment`. |
| `example-fetch-products.js` | Fetches a product list via the `product` endpoint. |
| `example-fetch-product-detail.js` | Fetches a random product detail page via `product/{productId}`. |
| `example-fetch-product-listing.js` | Fetches a product listing for a random category via `product-listing/{categoryId}`. |
| `example-search-products.js` | Searches for products using a random keyword via the `search` endpoint. |
| `example-search-suggest.js` | Fetches search suggestions using a random keyword via `search-suggest`. |
| `example-fetch-category.js` | Fetches a random category listing page via the `category/{id}` endpoint. |
| `example-fetch-categories.js` | Fetches the category list/tree via the `category` endpoint (no ID). |
| `example-fetch-navigation-categories.js` | Fetches the main navigation and then fetches each child category via the `navigation` and `category` endpoints. |
| `example-fetch-cms-page.js` | Fetches a category to find its CMS page ID, then fetches the CMS page via `cms/{id}`. |
| `example-fetch-landing-page.js` | Fetches a landing page via `landing-page/{id}`. Requires `LANDING_PAGE_ID` env variable. |
| `example-fetch-breadcrumb.js` | Fetches the breadcrumb for a random category via `breadcrumb/{id}`. |
| `example-fetch-payment-methods.js` | Creates a context and fetches available payment methods via the `payment-method` endpoint. |
| `example-fetch-shipping-methods.js` | Creates a context and fetches available shipping methods via the `shipping-method` endpoint. |
| `example-fetch-wishlist.js` | Registers a user and fetches their wishlist via `customer/wishlist`. |
| `example-add-to-wishlist.js` | Registers a user and adds a product to the wishlist via `customer/wishlist/add/{productId}`. |
| `example-delete-from-wishlist.js` | Registers a user, adds a product to wishlist, then removes it via `customer/wishlist/delete/{productId}`. |
| `example-fetch-countries.js` | Fetches the list of countries via the `country` endpoint. |
| `example-fetch-country-states.js` | Fetches states for a country via `country-state/{countryId}`. |
| `example-fetch-currencies.js` | Fetches the list of currencies via the `currency` endpoint. |
| `example-fetch-languages.js` | Fetches the list of languages via the `language` endpoint. |
| `example-fetch-salutations.js` | Fetches the list of salutations via the `salutation` endpoint. |
| `example-fetch-cookie-groups.js` | Fetches cookie consent groups via the `cookie-groups` endpoint. |
| `example-fetch-seo-url.js` | Fetches SEO URLs via the `seo-url` endpoint. |
| `example-fetch-sitemap.js` | Fetches the sitemap index via the `sitemap` endpoint. |
| `example-fetch-info-routes.js` | Fetches the route list via the `_info/routes` endpoint (smoke test). |

### Customising payloads

All request payloads are defined in `helpers/store-api/payloads/`. Each payload has its own file that exports a factory function with sensible defaults:

| Payload file | Factory function | Used by |
|---|---|---|
| `payloads/register-user.js` | `getRegisterUserPayload()` | register-user, add-user-address, create-guest-order, fetch-customer, fetch-wishlist, add-to-wishlist, delete-from-wishlist, change-profile, list-addresses, logout-user, set-default-billing/shipping-address, fetch-orders, cancel-order, handle-order-payment |
| `payloads/login-user.js` | `getLoginUserPayload()` | login-user |
| `payloads/add-to-cart.js` | `getAddToCartPayload()` | add-product-to-cart, create-guest-order, delete-cart-line-item, fetch-orders, cancel-order, handle-order-payment |
| `payloads/add-address.js` | `getAddAddressPayload()` | add-user-address, set-default-billing-address, set-default-shipping-address |
| `payloads/create-order.js` | `getCreateOrderPayload()` | create-guest-order, fetch-orders, cancel-order, handle-order-payment |
| `payloads/change-profile.js` | `getChangeProfilePayload()` | change-profile |

To customise the data sent to the API you can:
- **Override defaults** — pass different values to the factory function (e.g. `getRegisterUserPayload({ firstName: "Custom" })`)
- **Replace a file** — swap the payload file with your own implementation keeping the same export signature
- **Wrap the factory** — import the original, call it, and extend the returned object with additional fields

## Optional: Storefront Basic Auth

If your storefront is protected by HTTP Basic Authentication, you can provide credentials via the environment variables `STOREFRONT_USERNAME` and `STOREFRONT_PASSWORD`.

## For more information

See the [K6 documentation](https://k6.io/docs/) or the [Shopware Documentation](https://developer.shopware.com/docs/guides/hosting/performance/k6.html).
