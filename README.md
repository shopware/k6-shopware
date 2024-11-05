# Grafana K6 with Shopware

This repository contains helpers and an example scenario to run K6 against a Shopware Shop.

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
