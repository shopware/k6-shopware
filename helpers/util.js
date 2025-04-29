import http from 'k6/http';
import { FormData } from '../lib/form-data.js';

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

	const params = {
		headers: {
			'Content-Type':
				'multipart/form-data; boundary=' + formData.boundary,
		},
		tags: {
			name: tag,
		},
		redirects: 0, // Disable automatic redirects
	};

	const response = http.post(url, formData.body(), params);

	// Check if the response is a redirect
	if (response.status >= 300 && response.status < 400) {
		let redirectUrl = response.headers.Location;

		if (!redirectUrl.startsWith('http')) {
			const regex =
				/^(?:(http[s]?):\/\/)?([a-z0-9_\-.]+)(?:\:([0-9]+))?/gm;

			const match = url.match(regex);
			redirectUrl = match[0] + redirectUrl;
		}

		// Make the GET request to the redirect URL
		const redirectResponse = http.get(redirectUrl, {
			tags: {
				name: tag + '_redirect',
			},
		});

		return redirectResponse;
	} else {
		return response;
	}
}
