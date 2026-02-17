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
