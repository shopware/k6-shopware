import { FormData } from "./form-data.js";
import http from "k6/http";

function between(min, max) {
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

  return http.post(url, formData.body(), {
    headers: {
      "Content-Type": "multipart/form-data; boundary=" + formData.boundary,
    },
    tags: {
      name: tag,
    },
  });
}
