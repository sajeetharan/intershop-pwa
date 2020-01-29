export const environment = {
  // which store files to migrate
  control: {
    actions: true,
    reducer: true,
    effects: true,
  },
  // save files after complete migration?
  save: true,
  // save files after individual store migration?
  saveIndividual: false,
  // path to project tsconfig file
  tsconfig: 'D:/projects/pwa-github/tsconfig.json',
  // whether to migrate tests
  tests: true,
  // list of stores, option for explicit paths
  stores: [
    'addresses',
    { name: 'viewconf', path: 'src/app/core/store/checkout/viewconf' },
    'basket',
    'basket-addresses',
    'basket-items',
    'basket-payment',
    'basket-validation',
    'basket-promotion-code',
    //  'configuration',
    'contact',
    'includes',
    'pagelets',
    'pages',
    'countries',
    'error',
    'locale',
    'messages',
    'orders',
    'regions',
    'restore',
    'categories',
    'compare',
    'filter',
    'product-listing',
    'products',
    'promotions',
    'recently',
    'search',
    'user',
    { name: 'viewconf', path: 'src/app/core/store/viewconf' },
    // extensions:
    'wishlist',
    'quote',
    'quote-request',
    'seo',
    'sentry-config',
  ],
};
