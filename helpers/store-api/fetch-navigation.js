import { check } from "k6";
import http from "k6/http";
import { salesChannel } from "../data.js";

/**
 * Recursively collects all category IDs from the navigation tree (including nested children).
 * @param {Array} categories - Navigation items (may have .id and .children)
 * @returns {string[]} Flat array of category IDs
 */
function collectCategoryIdsFromNavigation(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return [];
  }
  const ids = [];
  for (const item of categories) {
    if (item?.id) {
      ids.push(item.id);
    }
    if (Array.isArray(item?.children) && item.children.length > 0) {
      ids.push(...collectCategoryIdsFromNavigation(item.children));
    }
  }
  return ids;
}

export function fetchMainNavigationViaStoreApi(trend, counter) {
  const stepStart = Date.now();
  const resp = http.post(
    `${salesChannel[0].url}/store-api/navigation/main-navigation/main-navigation`,
    "{}",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "sw-access-key": salesChannel[0].accessKey,
      },
      tags: {
        name: "api.navigation.main",
      },
    }
  );
  trend.add(Date.now() - stepStart);
  counter.add(1);

  const success = check(resp, {
    "Store API main navigation fetch is successful": (r) => r.status === 200,
  });

  if (!success) {
    console.log(`Store API main navigation fetch failed: ${resp.body}`);
    return { categories: [], status: resp.status };
  }

  try {
    const body = resp.json();
    const categories = body?.children || body?.data?.children || [];
    return { categories, status: resp.status, body };
  } catch {
    return { categories: [], status: resp.status };
  }
}

export function fetchNavigationAndCategoriesViaStoreApi(
  navigationTrend,
  navigationCounter,
  categoryTrend,
  categoryCounter
) {
  const navigationResult = fetchMainNavigationViaStoreApi(
    navigationTrend,
    navigationCounter
  );

  if (navigationResult.status !== 200 || !navigationResult.categories) {
    return {
      navigationStatus: navigationResult.status,
      categoriesFetched: 0,
      categoryStatuses: [],
    };
  }

  const categoryIds = collectCategoryIdsFromNavigation(
    navigationResult.categories
  );
  const categoryStatuses = [];
  let categoriesFetched = 0;

  for (const categoryId of categoryIds) {
    const categoryStepStart = Date.now();
    const categoryResp = http.post(
      `${salesChannel[0].url}/store-api/category/${categoryId}`,
      "{}",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "sw-access-key": salesChannel[0].accessKey,
        },
        tags: {
          name: "api.category.fetch_from_navigation",
        },
      }
    );
    categoryTrend.add(Date.now() - categoryStepStart);
    categoryCounter.add(1);

    const categorySuccess = check(categoryResp, {
      [`Store API category ${categoryId} fetch is successful`]: (r) =>
        r.status === 200,
    });

    if (!categorySuccess) {
      console.log(
        `Store API category ${categoryId} fetch failed: ${categoryResp.body}`
      );
    }

    categoryStatuses.push({
      categoryId,
      status: categoryResp.status,
    });

    if (categoryResp.status === 200) {
      categoriesFetched++;
    }
  }

  return {
    navigationStatus: navigationResult.status,
    categoriesFetched,
    totalCategories: categoryIds.length,
    categoryStatuses,
  };
}
