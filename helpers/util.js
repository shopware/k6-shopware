import { FormData } from "../lib/form-data.js";
import http from "k6/http";
import { URL } from '../lib/k6-utils.js';

export function between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomItem(map) {
  return map[between(0, map.length - 1)];
}

export function postFormData(url, data, tag) {
  const formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  let params = {
    headers: {
      "Content-Type": "multipart/form-data; boundary=" + formData.boundary,
    },
    tags: {
      name: tag,
    },
    redirects: 0,  // Disable automatic redirects
  };

  let response = http.post(url, formData.body(), params);

  // Check if the response is a redirect
  if (response.status >= 300 && response.status < 400) {
    let redirectUrl = response.headers.Location;

    if (!redirectUrl.startsWith('http')) {
      redirectUrl = new URL(redirectUrl, url).toString();
    }

    // Make the GET request to the redirect URL
    let redirectResponse = http.get(redirectUrl);

    return redirectResponse
  } else {
    return response
  }
}
