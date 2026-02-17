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

### Available tests

| Test file | Description |
|---|---|
| `example-register-user.js` | Registers a new user account via the `account/register` endpoint. |
| `example-login-user.js` | Registers a new user and then logs in via the `account/login` endpoint. |
| `example-add-product.js` | Adds a random product to the cart via the `checkout/cart/line-item` endpoint. Supports `PRODUCT_COUNT` env variable. |
| `example-add-user-address.js` | Creates a context, registers a user, and adds a new address via the `account/address` endpoint. |
| `example-fetch-category.js` | Fetches a random category listing page via the `category` endpoint. |
| `example-fetch-navigation-categories.js` | Fetches the main navigation and then fetches each child category via the `navigation` and `category` endpoints. |
| `example-fetch-payment-methods.js` | Creates a context and fetches available payment methods via the `checkout/payment-method` endpoint. |
| `example-guest-order-store-api.js` | Full guest checkout flow: creates context, adds product to cart, registers as guest, and places an order. Supports `PRODUCT_QUANTITY` env variable. |

### Customising payloads

All request payloads are defined in `helpers/store-api/payloads/`. Each payload has its own file that exports a factory function with sensible defaults:

| Payload file | Factory function | Used by |
|---|---|---|
| `payloads/register-user.js` | `getRegisterUserPayload()` | register-user, add-user-address, create-guest-order |
| `payloads/login-user.js` | `getLoginUserPayload()` | login-user |
| `payloads/add-to-cart.js` | `getAddToCartPayload()` | add-product-to-cart, create-guest-order |
| `payloads/add-address.js` | `getAddAddressPayload()` | add-user-address |
| `payloads/create-order.js` | `getCreateOrderPayload()` | create-guest-order |

To customise the data sent to the API you can:
- **Override defaults** — pass different values to the factory function (e.g. `getRegisterUserPayload({ firstName: "Custom" })`)
- **Replace a file** — swap the payload file with your own implementation keeping the same export signature
- **Wrap the factory** — import the original, call it, and extend the returned object with additional fields

## Optional: Storefront Basic Auth

If your storefront is protected by HTTP Basic Authentication, you can provide credentials via the environment variables `STOREFRONT_USERNAME` and `STOREFRONT_PASSWORD`.

## For more information

See the [K6 documentation](https://k6.io/docs/) or the [Shopware Documentation](https://developer.shopware.com/docs/guides/hosting/performance/k6.html).
