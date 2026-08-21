FROM oven/bun AS fetcher

WORKDIR /app
COPY package.* bun.* *.ts /app/

RUN bun install
RUN \
    --mount=type=secret,id=SHOP_URL,env=SHOP_URL \
    --mount=type=secret,id=SHOP_ADMIN_USERNAME,env=SHOP_ADMIN_USERNAME \
    --mount=type=secret,id=SHOP_ADMIN_PASSWORD,env=SHOP_ADMIN_PASSWORD \
    --mount=type=secret,id=STOREFRONT_USERNAME,env=STOREFRONT_USERNAME \
    --mount=type=secret,id=STOREFRONT_PASSWORD,env=STOREFRONT_PASSWORD \
    bun run fetch-fixtures.ts


FROM grafana/k6 AS without-fetch

WORKDIR /app
COPY . /app

FROM grafana/k6

WORKDIR /app
COPY . /app
COPY --from=fetcher /app/fixtures /app/fixtures
