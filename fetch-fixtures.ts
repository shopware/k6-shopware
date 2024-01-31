import { createAdminAPIClient } from "@shopware/api-client";

const auth = (await (
  await fetch(`${process.env.SHOP_URL}/api/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: "administration",
      grant_type: "password",
      username: process.env.SHOP_ADMIN_USERNAME,
      password: process.env.SHOP_ADMIN_PASSWORD,
    }),
  })
).json()) as {
  access_token?: string;
  refresh_token: string;
  expires_in: number;
};

if (!auth.access_token) {
  console.log(auth);
  throw new Error("Could not authenticate");
}

import type {
  operationPaths,
  operations,
} from "@shopware/api-client/admin-api-types";

export const adminApiClient = createAdminAPIClient<operations, operationPaths>({
  baseURL: `${process.env.SHOP_URL}/api`,
  sessionData: {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    expirationTime: auth.expires_in,
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
      limit: 500,
    },
  );

  const data = seoUrls.data.map((seoUrl) => {
    return {
      url: `${salesChannel.url}/${seoUrl.seoPathInfo}`,
      id: seoUrl.foreignKey,
    };
  });

  Bun.write(`fixtures/seo-${name}.json`, JSON.stringify(data));
}

await Promise.all([
  fetchSeoUrls("frontend.navigation.page"),
  fetchSeoUrls("frontend.detail.page"),
]);
