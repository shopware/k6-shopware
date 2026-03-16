/**
 * Parses a product quantity from an env or config value.
 * Returns a finite positive integer; falls back to 1 when the value is NaN, non-finite, or not positive.
 * Avoids JSON.stringify turning NaN into null in payloads.
 */
export function parseProductQuantity(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.floor(n);
}

export function randomString(length = 12) {
  let value = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return value;
}

export function getStoreApiContextToken(response) {
  const headerToken =
    response.headers["sw-context-token"] ||
    response.headers["Sw-Context-Token"];

  if (headerToken) {
    return headerToken;
  }

  try {
    const body = response.json();
    return body?.token || body?.contextToken || "";
  } catch {
    return "";
  }
}

export function mergeContextToken(currentToken, response) {
  const nextToken = getStoreApiContextToken(response);
  return nextToken || currentToken;
}

/**
 * Parses the Store API product list response and returns a buyable product id, or null.
 * Supports common shapes: { elements }, { data }, { products: { elements } }.
 */
export function getFirstProductIdFromProductListResponse(response) {
  try {
    const body = response.json();
    const elements =
      body?.elements ?? body?.data ?? body?.products?.elements ?? [];
    const products = Array.isArray(elements) ? elements : [];

    // Prefer variants/simple products to avoid non-buyable parent products.
    const preferred = products.find((p) => {
      const hasId = p?.id != null;
      const isAvailable = p?.available !== false;
      const isActive = p?.active !== false;
      const isVariantOrSimple =
        p?.parentId != null || Number(p?.childCount ?? 0) === 0;
      const hasStock = p?.availableStock == null || p.availableStock > 0;

      return hasId && isAvailable && isActive && isVariantOrSimple && hasStock;
    });

    if (preferred?.id) {
      return preferred.id;
    }

    const first = products[0];
    return first?.id ?? null;
  } catch {
    return null;
  }
}
