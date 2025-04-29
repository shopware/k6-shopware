import { SharedArray } from 'k6/data';

export const salesChannel = new SharedArray('salesChannel', () =>
	JSON.parse(open('../fixtures/sales-channel.json')),
);

export const seoProductDetailPage = new SharedArray(
	'seoProductDetailPage',
	() => JSON.parse(open('../fixtures/seo-frontend.detail.page.json')),
);

export const seoListingPage = new SharedArray('seoListingPage', () =>
	JSON.parse(open('../fixtures/seo-frontend.navigation.page.json')),
);

export const searchKeywords = new SharedArray('searchKeywords', () =>
	JSON.parse(open('../fixtures/keywords.json')),
);

export const media = new SharedArray('media', () =>
	JSON.parse(open('../fixtures/media.json')),
);

export const propertyGroupOption = new SharedArray(
	'property_group_option',
	() => JSON.parse(open('../fixtures/property_group_option.json')),
);
