export class ApiClient {
	private url: string;
	private username: string;
	private password: string;

	private storage: { expiresIn: Date | null; token: string | null };

	constructor(url: string, username: string, password: string) {
		this.url = url;
		this.username = username;
		this.password = password;
		this.storage = {
			token: null,
			expiresIn: null,
		};
	}

	/**
	 * Permform a GET request
	 */
	async get<ResponseType>(
		url: string,
		headers: Record<string, string> = {},
	): Promise<HttpClientResponse<ResponseType>> {
		return await this.request('GET', url, null, headers);
	}

	/**
	 * Perform a POST request with optional Accept header customization
	 */
	async post<ResponseType>(
		url: string,
		json: object = {},
		headers: Record<string, string> = {},
		acceptAll = false, // 👈 Optional flag to control Accept header
	): Promise<HttpClientResponse<ResponseType>> {
		headers['content-type'] = 'application/json';
		headers.accept = acceptAll ? '*/*' : 'application/json'; // 👈 Choose Accept header dynamically

		return await this.request('POST', url, JSON.stringify(json), headers);
	}

	/**
	 * Permform a PUT request
	 */
	async put<ResponseType>(
		url: string,
		json: object = {},
		headers: Record<string, string> = {},
	): Promise<HttpClientResponse<ResponseType>> {
		headers['content-type'] = 'application/json';
		headers.accept = 'application/json';

		return await this.request('PUT', url, JSON.stringify(json), headers);
	}

	/**
	 * Permform a PATCH request
	 */
	async patch<ResponseType>(
		url: string,
		json: object = {},
		headers: Record<string, string> = {},
	): Promise<HttpClientResponse<ResponseType>> {
		headers['content-type'] = 'application/json';
		headers.accept = 'application/json';

		return await this.request('PATCH', url, JSON.stringify(json), headers);
	}

	/**
	 * Permform a DELETE request
	 */
	async delete<ResponseType>(
		url: string,
		json: object = {},
		headers: Record<string, string> = {},
	): Promise<HttpClientResponse<ResponseType>> {
		headers['content-type'] = 'application/json';
		headers.accept = 'application/json';

		return await this.request('DELETE', url, JSON.stringify(json), headers);
	}

	private async request<ResponseType>(
		method: string,
		url: string,
		body: string | null = '',
		headers: Record<string, string> = {},
	): Promise<HttpClientResponse<ResponseType>> {
		const f = await globalThis.fetch(`${this.url}/api${url}`, {
			body,
			headers: Object.assign(
				{
					Authorization: `Bearer ${await this.getToken()}`,
				},
				headers,
			),
			method,
		});

		// Obtain new token
		if (!f.ok && f.status === 401) {
			this.storage.expiresIn = null;

			return await this.request(method, url, body, headers);
		}
		if (!f.ok) {
			throw new ApiClientRequestFailed(
				new HttpClientResponse(f.status, await f.json(), f.headers),
			);
		}

		if (f.status === 204) {
			return new HttpClientResponse<ResponseType>(
				f.status,
				{} as ResponseType,
				f.headers,
			);
		}

		return new HttpClientResponse(f.status, await f.json(), f.headers);
	}

	/**
	 * Obtain a valid bearer token
	 */
	async getToken(): Promise<string> {
		if (this.storage.expiresIn === null) {
			const auth = await globalThis.fetch(`${this.url}/api/oauth/token`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					grant_type: 'password',
					client_id: 'administration',
					username: this.username,
					password: this.password,
					scopes: 'write',
				}),
			});

			if (!auth.ok) {
				const contentType =
					auth.headers.get('content-type') || 'text/plain';
				let body = '';

				if (contentType.indexOf('application/json') !== -1) {
					body = await auth.json();
				} else {
					body = await auth.text();
				}

				throw new ApiClientAuthenticationFailed(
					new HttpClientResponse<string>(
						auth.status,
						body,
						auth.headers,
					),
				);
			}

			const expireDate = new Date();
			const authBody = (await auth.json()) as {
				access_token: string;
				expires_in: number;
			};
			this.storage.token = authBody.access_token;
			expireDate.setSeconds(
				expireDate.getSeconds() + authBody.expires_in,
			);
			this.storage.expiresIn = expireDate;

			return this.storage.token as string;
		}

		if (this.storage.expiresIn.getTime() < Date.now()) {
			// Expired

			this.storage.expiresIn = null;

			return await this.getToken();
		}

		return this.storage.token as string;
	}
}

/**
 * HttpClientResponse is the response object of the HttpClient
 */
export class HttpClientResponse<ResponseType> {
	constructor(
		public statusCode: number,
		public body: ResponseType,
		public headers: Headers,
	) {}
}

type ShopwareErrorResponse = {
	errors: {
		code: string;
		status: string;
		title: string;
		detail: string;
	}[];
};

/**
 * ApiClientAuthenticationFailed is thrown when the authentication to the shop's API fails
 */
export class ApiClientAuthenticationFailed extends Error {
	constructor(public response: HttpClientResponse<string>) {
		super(
			`The api client authentication failed with response: ${JSON.stringify(response.body)}`,
		);
	}
}

/**
 * ApiClientRequestFailed is thrown when the request to the shop's API fails
 */
export class ApiClientRequestFailed extends Error {
	constructor(public response: HttpClientResponse<ShopwareErrorResponse>) {
		super(
			`The api request failed with status code: ${response.statusCode}`,
		);
	}
}
