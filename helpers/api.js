import { uuidv4 } from './k6-utils.js';
import { between, getRandomItem } from './util.js';
import { check } from "k6";
import { salesChannel, seoProductDetailPage, seoListingPage, media, propertyGroupOption } from './data.js';
import http from "k6/http";

let credentials = {};

/**
* @returns {{access_token: string, expires_in: number, token_type: string}}
*/
export function fetchBearerToken() {
  const resp = http.post(`${salesChannel[0].api.baseURL}/oauth/token`, JSON.stringify(salesChannel[0].api.credentials), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
export function productImport(count = 20) {
  const products = [];

  const hasProperties = propertyGroupOption.length > 0;

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
        }
      ],
      visibilities: [
        {
          salesChannelId: salesChannel[0].id,
          visibility: 30,
        }
      ],
      categories: [
        {
          id: getRandomItem(seoListingPage).id,
        }
      ],
      media: [
        {
          mediaId: getRandomItem(media),
        }
      ],
      taxId: getRandomItem(salesChannel[0].taxIds),
      stock: between(1, 500),
      isCloseout: false,
    };

    // Add properties only if propertyGroupOption has values
    if (hasProperties) {
      product.properties = [
        {
          id: getRandomItem(propertyGroupOption),
        }
      ];
    }

    products.push(product);
  }

  const payload = [
    {
      key: 'product-import',
      action: 'upsert',
      entity: 'product',
      payload: products,
    }
  ];

  const resp = http.post(`${salesChannel[0].api.baseURL}/_action/sync`, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.access_token}`,
    },
    tags: {
      name: 'api.product.import',
    },
  });

  check(resp, {
    'Import products is successful': (r) => r.status === 200,
  });
}

export function productChangeStocks(count = 20) {
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
    }
  ];

  const resp = http.post(`${salesChannel[0].api.baseURL}/_action/sync`, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.access_token}`,
    },
    tags: {
      name: 'api.product.stock_update',
    },
  });

  check(resp, {
    'Product stock update is successful': (r) => r.status === 200,
  });
}

export function productChangePrice(count = 20) {
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
        }
      ],
    });
  }

  const payload = [
    {
      key: 'product-price-update',
      action: 'upsert',
      entity: 'product',
      payload: products,
    }
  ];

  const resp = http.post(`${salesChannel[0].api.baseURL}/_action/sync`, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.access_token}`,
    },
    tags: {
      name: 'api.product.price_update',
    },
  });

  check(resp, {
    'Product price update is successful': (r) => r.status === 200,
  });
}
