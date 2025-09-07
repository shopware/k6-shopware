import { check } from 'k6';
import http from 'k6/http';
import {
	media,
	salesChannel,
	seoListingPage,
	seoProductDetailPage,
} from './data.js';
import { between, getRandomItem } from './util.js';

function uuidv4() {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

let credentials = {};

/**
 * @returns {{access_token: string, expires_in: number, token_type: string}}
 */
export function fetchBearerToken(trend, counter) {
	const stepStart = Date.now();
	const resp = http.post(
		`${salesChannel[0].api.baseURL}/oauth/token`,
		JSON.stringify(salesChannel[0].api.credentials),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
	trend.add(Date.now() - stepStart);
	counter.add(1);

	return resp.json();
}

/**
 * @param {{access_token: string, expires_in: number, token_type: string}} creds
 */
export function useCredentials(creds) {
	credentials = creds;
}

/**
 * @param {number} count
 */
export function productImport(trend, counter, count = 20) {
	const products = [];

	for (let i = 0; i < count; i++) {
		const product = {
			name: `Product ${i}`,
			description: `Description of product ${i}`,
			productNumber: uuidv4(),
			active: true,
			price: [
				{
					currencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
					gross: between(100, 1000),
					net: between(100, 1000),
					linked: false,
				},
			],
			visibilities: [
				{
					salesChannelId: salesChannel[0].id,
					visibility: 30,
				},
			],
			categories: [
				{
					id: getRandomItem(seoListingPage).id,
				},
			],
			media: [
				{
					mediaId: getRandomItem(media),
				},
			],
			taxId: getRandomItem(salesChannel[0].taxIds),
			stock: between(1, 500),
			isCloseout: false,
		};

		products.push(product);
	}

	const payload = [
		{
			key: 'product-import',
			action: 'upsert',
			entity: 'product',
			payload: products,
		},
	];

	const stepStart = Date.now();
	const resp = http.post(
		`${salesChannel[0].api.baseURL}/_action/sync`,
		JSON.stringify(payload),
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${credentials.access_token}`,
				'indexing-behavior': 'use-queue-indexing',
			},
			tags: {
				name: 'api.product.import',
			},
		},
	);
	trend.add(Date.now() - stepStart);
	counter.add(1);

	if (resp.status === 400) {
		console.log(`Product import failed: ${resp.body}`);
	}

	check(resp, {
		'Import products is successful': (r) => r.status === 200,
	});
}

export function productChangeStocks(trend, counter, count = 20) {
	const products = [];

	for (let i = 0; i < count; i++) {
		products.push({
			id: getRandomItem(seoProductDetailPage).id,
			stock: between(1, 500),
		});
	}

	const payload = [
		{
			key: 'product-stock-update',
			action: 'upsert',
			entity: 'product',
			payload: products,
		},
	];

	const stepStart = Date.now();
	const resp = http.post(
		`${salesChannel[0].api.baseURL}/_action/sync`,
		JSON.stringify(payload),
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${credentials.access_token}`,
				'indexing-behavior': 'use-queue-indexing',
			},
			tags: {
				name: 'api.product.stock_update',
			},
		},
	);
	trend.add(Date.now() - stepStart);
	counter.add(1);

	if (resp.status === 400) {
		console.log(`Stock update failed: ${resp.body}`);
	}

	check(resp, {
		'Product stock update is successful': (r) => r.status === 200,
	});
}

export function productChangePrice(trend, counter, count = 20) {
	const products = [];

	for (let i = 0; i < count; i++) {
		products.push({
			id: getRandomItem(seoProductDetailPage).id,
			price: [
				{
					currencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
					gross: between(100, 1000),
					net: between(100, 1000),
					linked: false,
				},
			],
		});
	}

	const payload = [
		{
			key: 'product-price-update',
			action: 'upsert',
			entity: 'product',
			payload: products,
		},
	];

	const stepStart = Date.now();
	const resp = http.post(
		`${salesChannel[0].api.baseURL}/_action/sync`,
		JSON.stringify(payload),
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${credentials.access_token}`,
				'indexing-behavior': 'use-queue-indexing',
			},
			tags: {
				name: 'api.product.price_update',
			},
		},
	);
	trend.add(Date.now() - stepStart);
	counter.add(1);

	if (resp.status === 400) {
		console.log(`Price update failed: ${resp.body}`);
	}

	check(resp, {
		'Product price update is successful': (r) => r.status === 200,
	});
}
