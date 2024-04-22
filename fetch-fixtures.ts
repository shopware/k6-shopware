import { createAdminAPIClient } from "@shopware/api-client";

import type {
  operationPaths,
  operations,
} from "@shopware/api-client/admin-api-types";

export const adminApiClient = createAdminAPIClient<operations, operationPaths>({
  baseURL: `${process.env.SHOP_URL}/api`,
  credentials: {
    grant_type: "password",
    client_id: "administration",
    scopes: "write",
    username: process.env.SHOP_ADMIN_USERNAME as string,
    password: process.env.SHOP_ADMIN_PASSWORD as string,
  },
});

async function fetchSalesChannel() {
  const data = await adminApiClient.invoke(
    "searchSalesChannel post /search/sales-channel",
    {
      fields: ["id", "name", "accessKey", "domains.url", "countries.id"],
      filter: [
        {
          type: "equals",
          field: "active",
          value: true,
        },
        {
          type: "not",
          queries: [
            {
              type: "equals",
              field: "name",
              value: "Headless",
            },
          ],
        },
      ],
    },
  );

  const salutationIds = await adminApiClient.invoke(
    "salutation post /search-ids/salutation",
  );

  const records = data.data.map((record) => {
    return {
      id: record.id,
      name: record.name,
      accessKey: record.accessKey,
      url: record.domains[0].url,
      countryIds: record.countries.map((e) => e.id),
      salutationIds: salutationIds.data,
    };
  });

  Bun.write("fixtures/sales-channel.json", JSON.stringify(records));
  console.log(`Collected ${records.length} sales channels`);
  console.log(`Collected ${salutationIds.data.length} salutations`);

  return records[0];
}

const salesChannel = await fetchSalesChannel();

async function fetchSeoUrls(name: string) {
  const seoUrls = await adminApiClient.invoke(
    "searchSeoUrl post /search/seo-url",
    {
      fields: ["seoPathInfo", "foreignKey"],
      filter: [
        {
          type: "equals",
          field: "routeName",
          value: name,
        },
        {
          type: "equals",
          field: "isCanonical",
          value: true,
        },
        {
          type: "equals",
          field: "salesChannelId",
          value: salesChannel.id,
        },
      ],
      limit: 1000,
    },
  );

  const data = seoUrls.data.map((seoUrl) => {
    return {
      url: `${salesChannel.url}/${seoUrl.seoPathInfo}`,
      id: seoUrl.foreignKey,
    };
  });

  Bun.write(`fixtures/seo-${name}.json`, JSON.stringify(data));
  console.log(`Collected ${data.length} seo urls for ${name}`);
}

await Promise.all([
  fetchSeoUrls("frontend.navigation.page"),
  fetchSeoUrls("frontend.detail.page"),
]);

const keywords = await adminApiClient.invoke(
  "getProductSearchKeyword post /search/product-search-keyword",
  {
    limit: 500,
  },
);

const uniqueKeywords = keywords.data
  .map((k) => k.keyword)
  .filter((value, index, array) => array.indexOf(value) === index);

Bun.write("fixtures/keywords.json", JSON.stringify(uniqueKeywords));
console.log(`Collected ${uniqueKeywords.length} search keywords`);
