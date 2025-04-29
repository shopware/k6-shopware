import { SharedArray } from 'k6/data';

export const salesChannel = new SharedArray('salesChannel', function () {
	return JSON.parse(open('../fixtures/sales-channel.json'));
});

export const seoProductDetailPage = new SharedArray(
	'seoProductDetailPage',
	function () {
		return JSON.parse(open('../fixtures/seo-frontend.detail.page.json'));
	},
);

export const seoListingPage = new SharedArray('seoListingPage', function () {
	return JSON.parse(open('../fixtures/seo-frontend.navigation.page.json'));
});

export const searchKeywords = new SharedArray('searchKeywords', function () {
	return JSON.parse(open('../fixtures/keywords.json'));
});

export const media = new SharedArray('media', function () {
	return JSON.parse(open('../fixtures/media.json'));
});

export const propertyGroupOption = new SharedArray(
	'property_group_option',
	function () {
		return JSON.parse(open('../fixtures/property_group_option.json'));
	},
);
