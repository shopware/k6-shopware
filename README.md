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

## Optional: Storefront Basic Auth

If your storefront is protected by HTTP Basic Authentication, you can provide credentials via the environment variables `STOREFRONT_USERNAME` and `STOREFRONT_PASSWORD`.

## For more information

See the [K6 documentation](https://k6.io/docs/) or the [Shopware Documentation](https://developer.shopware.com/docs/guides/hosting/performance/k6.html).
