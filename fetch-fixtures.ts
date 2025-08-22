import * as fs from 'node:fs';
import { parseArgs } from 'node:util';
import { ApiClient } from './api-client.ts';

const { values } = parseArgs({
	options: {
		'seo-urls': {
			type: 'string',
			description: 'Limit the number of SEO URLs to fetch',
		},
		help: {
			type: 'boolean',
			description: 'Show help information',
		},
	},
});

// Display help if requested
if (values.help) {
	console.log('Shopware K6 Fixture Generator');
	console.log('\nUsage: node fetch-fixtures.ts [options]\n');
	console.log('Options:');
	console.log('  --seo-urls <number>  Limit the number of SEO URLs to fetch');
	console.log('  --help              Show this help information');
	process.exit(0);
}

if (!fs.existsSync('fixtures')) {
	fs.mkdirSync('fixtures');
}

const seoUrlsLimit = values['seo-urls']
	? Number.parseInt(values['seo-urls'] as string, 10)
	: undefined;

const apiClient = new ApiClient(
	process.env.SHOP_URL as string,
	process.env.SHOP_ADMIN_USERNAME as string,
	process.env.SHOP_ADMIN_PASSWORD as string,
);

type SalesChannel = {
	id: string;
	name: string;
	accessKey: string;
	domains: {
		url: string;
	}[];
	countries: {
		id: string;
	}[];
};

async function fetchSalesChannel() {
	const response = await apiClient.post<{ data: SalesChannel[] }>(
		'/search/sales-channel',
		{
			fields: ['id', 'name', 'accessKey', 'domains.url', 'countries.id'],
			filter: [
				{
					type: 'equals',
					field: 'active',
					value: true,
				},
				{
					type: 'not',
					queries: [
						{
							type: 'equals',
							field: 'name',
							value: 'Headless',
						},
					],
				},
			],
		},
	);

	const salutationIds = await apiClient.post<{ data: string[] }>(
		'/search-ids/salutation',
		{},
	);

	const taxIds = await apiClient.post<{ data: string[] }>(
		'/search-ids/tax',
		{},
	);

	const records = response.body.data
		.filter((record) => record.domains && record.domains.length > 0)
		.map((record) => {
			return {
				id: record.id,
				name: record.name,
				accessKey: record.accessKey,
				url: record.domains[0].url,
				countryIds: record.countries.map((e) => e.id),
				salutationIds: salutationIds.body.data,
				taxIds: taxIds.body.data,
				api: {
					baseURL: `${process.env.SHOP_URL}/api`,
					credentials: {
						grant_type: 'password',
						client_id: 'administration',
						scopes: 'write',
						username: process.env.SHOP_ADMIN_USERNAME as string,
						password: process.env.SHOP_ADMIN_PASSWORD as string,
					},
				},
			};
		});

	fs.writeFileSync('fixtures/sales-channel.json', JSON.stringify(records));
	console.log(`Collected ${records.length} sales channels`);
	console.log(`Collected ${salutationIds.body.data.length} salutations`);

	return records[0];
}

const salesChannel = await fetchSalesChannel();

async function fetchSeoUrls(name: string) {
	// Get the limit from command line args if provided
	const limit = seoUrlsLimit;
	let page = 1;
	let allData: { url: string; id: string }[] = [];
	let hasMorePages = true;

	const maxPages = 100;
	while (hasMorePages && page <= maxPages) {
		// If we have a limit and we've reached it, stop fetching
		if (limit !== undefined && allData.length >= limit) {
			console.log(`Reached limit of ${limit} SEO URLs for ${name}`);
			break;
		}

		const response = await apiClient.post<{
			data: { attributes: { seoPathInfo: string; foreignKey: string } }[];
			links?: { next?: string };
		}>(
			'/search/seo-url',
			{
				fields: ['seoPathInfo', 'foreignKey'],
				filter: [
					{
						type: 'equals',
						field: 'routeName',
						value: name,
					},
					{
						type: 'equals',
						field: 'isCanonical',
						value: true,
					},
					{
						type: 'equals',
						field: 'isDeleted',
						value: false,
					},
					{
						type: 'equals',
						field: 'salesChannelId',
						value: salesChannel.id,
					},
				],
				limit: 500, // Max limit per request
				page: page, // Start from page 1
			},
			{},
			true,
		);

		const currentPageData = response.body.data.map((seoUrl) => ({
			url: `${salesChannel.url}/${seoUrl.attributes.seoPathInfo}`,
			id: seoUrl.attributes.foreignKey,
		}));

		allData = allData.concat(currentPageData);

		// If we have a limit and we've exceeded it after adding the current page data, trim the excess
		if (limit !== undefined && allData.length > limit) {
			allData = allData.slice(0, limit);
			hasMorePages = false;
		}

		// Check if there's a next page
		if (response.body.links?.next) {
			page++; // Move to the next page
		} else {
			hasMorePages = false; // Stop looping when no next page
		}
	}

	if (name === 'frontend.detail.page') {
		const productIds = allData.map((seoUrl) => seoUrl.id);

		if (productIds.length) {
			// Process IDs in batches of 500 due to API limitation
			const batchSize = 500;
			const allFilteredIds: string[] = [];

			// Split product IDs into batches of 500
			for (let i = 0; i < productIds.length; i += batchSize) {
				const batch = productIds.slice(i, i + batchSize);

				const filteredProductIds = await apiClient.post<{
					data: string[];
				}>(
					'/search-ids/product',
					{
						ids: batch,
						filter: [
							{
								type: 'equals',
								field: 'active',
								value: true,
							},
							{
								type: 'multi',
								operator: 'OR',
								queries: [
									{
										type: 'equals',
										field: 'childCount',
										value: 0,
									},
									{
										type: 'not',
										operator: 'AND',
										queries: [
											{
												type: 'equals',
												field: 'parentId',
												value: null,
											},
										],
									},
								],
							},
						],
					},
					{ 'sw-inheritance': '1' },
				);

				// Collect all filtered IDs from each batch
				allFilteredIds.push(...filteredProductIds.body.data);
			}
			// Filter the data using all collected IDs
			allData = allData.filter((seoUrl) =>
				allFilteredIds.includes(seoUrl.id),
			);
		}
	}

	fs.writeFileSync(`fixtures/seo-${name}.json`, JSON.stringify(allData));
	console.log(`Collected ${allData.length} seo urls for ${name}`);
}

async function fetchMedia() {
	const mediaIds = await apiClient.post<{ data: string[] }>(
		'/search-ids/media',
		{
			limit: 500,
		},
	);

	fs.writeFileSync('fixtures/media.json', JSON.stringify(mediaIds.body.data));
	console.log(`Collected ${mediaIds.body.data.length} media ids`);
}

async function fetchProperties() {
	const propertyIds = await apiClient.post<{ data: string[] }>(
		'/search-ids/property-group',
		{
			limit: 500,
		},
	);

	fs.writeFileSync(
		'fixtures/property_group_option.json',
		JSON.stringify(propertyIds.body.data),
	);
	console.log(`Collected ${propertyIds.body.data.length} property ids`);
}

await Promise.all([
	fetchProperties(),
	fetchMedia(),
	fetchSeoUrls('frontend.navigation.page'),
	fetchSeoUrls('frontend.detail.page'),
]);

const keywords = await apiClient.post<{ data: { keyword: string }[] }>(
	'/search/product-search-keyword',
	{
		limit: 500,
	},
);

const uniqueKeywords = keywords.body.data
	.map((k) => k.keyword)
	.filter((value, index, array) => array.indexOf(value) === index);

fs.writeFileSync('fixtures/keywords.json', JSON.stringify(uniqueKeywords));
console.log(`Collected ${uniqueKeywords.length} search keywords`);
