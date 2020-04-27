import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { Product, ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';
export const loadProduct = createAction('[Shopping] Load Product', props<{ payload: { sku: string } }>());
export const loadProductFail = createAction(
  '[Shopping] Load Product Fail',
  props<{ payload: { error: HttpError; sku: string } }>()
);
export const loadProductIfNotLoaded = createAction(
  '[Shopping] Load Product if not Loaded',
  props<{ payload: { sku: string; level: ProductCompletenessLevel } }>()
);
export const loadProductSuccess = createAction(
  '[Shopping] Load Product Success',
  props<{ payload: { product: Product } }>()
);
export const loadProductsForCategory = createAction(
  '[Shopping] Load Products for Category',
  props<{ payload: { categoryId: string; page?: number; sorting?: string } }>()
);
export const loadProductsForCategoryFail = createAction(
  '[Shopping] Load Products for Category Fail',
  props<{ payload: { error: HttpError; categoryId: string } }>()
);
export const loadProductVariations = createAction(
  '[Shopping] Load Product Variations',
  props<{ payload: { sku: string } }>()
);
export const loadProductVariationsFail = createAction(
  '[Shopping] Load Product Variations Fail',
  props<{ payload: { error: HttpError; sku: string } }>()
);
export const loadProductVariationsSuccess = createAction(
  '[Shopping] Load Product Variations Success',
  props<{ payload: { sku: string; variations: string[]; defaultVariation: string } }>()
);
export const loadProductBundlesSuccess = createAction(
  '[Shopping] Load Product Bundles Success',
  props<{ payload: { sku: string; bundledProducts: SkuQuantityType[] } }>()
);
export const loadRetailSetSuccess = createAction(
  '[Shopping] Load Retail Set Success',
  props<{ payload: { sku: string; parts: string[] } }>()
);
export const loadProductLinks = createAction('[Shopping] Load Product Links', props<{ payload: { sku: string } }>());
export const loadProductLinksFail = createAction(
  '[Shopping] Load Product Links Fail',
  props<{ payload: { error: HttpError; sku: string } }>()
);
export const loadProductLinksSuccess = createAction(
  '[Shopping] Load Product Links Success',
  props<{ payload: { sku: string; links: ProductLinks } }>()
);
