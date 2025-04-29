import fs from 'fs';
import { CheerioCrawler, Dataset, log } from 'crawlee';

const crawler = new CheerioCrawler({
	minConcurrency: 50,
	maxConcurrency: 200, // Adjust concurrency
	requestHandler: async ({ request, response, body, contentType }) => {
		const statusCode = response?.statusCode || 'unknown';
		//log.info(`Fetched: ${request.url} - Status Code: ${statusCode}`);
	},
	failedRequestHandler: async ({ request }) => {
		log.error(`Request failed: ${request.url}`);
	},
});

// Load URLs from JSON file
let jsonData = JSON.parse(
	fs.readFileSync('fixtures/seo-frontend.navigation.page.json', 'utf8'),
);
let urls = jsonData.map((entry) => entry.url);

// Add URLs to Crawlee queue
await crawler.run(urls);

// Load URLs from JSON file
jsonData = JSON.parse(
	fs.readFileSync('fixtures/seo-frontend.detail.page.json', 'utf8'),
);
urls = jsonData.map((entry) => entry.url);

// Add URLs to Crawlee queue
await crawler.run(urls);

log.info('Cache pre-warming complete!');
