import { check } from "k6";
import http from "k6/http";
import { salesChannel, seoListingPage } from "../data.js";
import { getRandomItem } from "../util.js";

export function fetchCmsPageViaStoreApi(trend, counter) {
  const flowStart = Date.now();
  const category = getRandomItem(seoListingPage);

  const categoryResp = http.post(
    `${salesChannel[0].url}/store-api/category/${category.id}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.category.fetch_for_cms" },
    }
  );

  let cmsPageId = null;
  try {
    const body = categoryResp.json();
    cmsPageId = body?.cmsPageId || body?.data?.cmsPageId || null;
  } catch {
    cmsPageId = null;
  }

  if (!cmsPageId) {
    console.log(
      `Store API fetch CMS page skipped: no cmsPageId found for category ${category.id}`
    );
    trend.add(Date.now() - flowStart);
    counter.add(1);
    check(categoryResp, {
      "Store API fetch CMS page: cmsPageId from category response": () => false,
    });
    return { categoryId: category.id, cmsPageId: null, status: 0 };
  }

  const resp = http.post(
    `${salesChannel[0].url}/store-api/cms/${cmsPageId}`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: { name: "api.cms.page.fetch" },
    }
  );
  trend.add(Date.now() - flowStart);
  counter.add(1);

  const success = check(resp, {
    "Store API fetch CMS page is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API fetch CMS page failed: ${resp.body}`);
  }

  return { categoryId: category.id, cmsPageId, status: resp.status };
}
