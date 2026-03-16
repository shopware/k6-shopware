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
 * Parses the Store API product list response and returns the first product id, or null.
 * Supports common shapes: { elements }, { data }, { products: { elements } }.
 */
export function getFirstProductIdFromProductListResponse(response) {
  try {
    const body = response.json();
    const elements = body?.elements ?? body?.data ?? body?.products?.elements ?? [];
    const first = Array.isArray(elements) ? elements[0] : null;
    return first?.id ?? null;
  } catch {
    return null;
  }
}
