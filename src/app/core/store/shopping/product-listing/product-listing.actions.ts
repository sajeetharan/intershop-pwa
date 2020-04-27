import { createAction, props } from '@ngrx/store';

import { ProductListingID, ProductListingType } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
export const setProductListingPages = createAction(
  '[ProductListing] Set Product Listing Pages',
  props<{ payload: ProductListingType }>()
);
export const setProductListingPageSize = createAction(
  '[ProductListing] Set Product Listing Page Size',
  props<{ payload: { itemsPerPage: number } }>()
);
export const loadMoreProducts = createAction(
  '[ProductListing] Load More Products',
  props<{ payload: { id: ProductListingID; page?: number } }>()
);
export const loadMoreProductsForParams = createAction(
  '[ProductListing Internal] Load More Products For Params',
  props<{ payload: { id: ProductListingID; page: number; sorting: string; filters: string } }>()
);
export const setViewType = createAction('[ProductListing] Set View Type', props<{ payload: { viewType: ViewType } }>());
export const loadPagesForMaster = createAction(
  '[ProductListing] Load Pages For Master',
  props<{ payload: { id: ProductListingID; filters: string; sorting: string } }>()
);
