import { createAction, props } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
export const loadFilterForCategory = createAction(
  '[Shopping] Load Filter For Category',
  props<{ payload: { uniqueId: string } }>()
);
export const loadFilterSuccess = createAction(
  '[Shopping] Load Filter Success',
  props<{ payload: { filterNavigation: FilterNavigation } }>()
);
export const loadFilterFail = createAction('[Shopping] Load Filter Fail', props<{ payload: { error: HttpError } }>());
export const loadFilterForSearch = createAction(
  '[Shopping] Load Filter for Search',
  props<{ payload: { searchTerm: string } }>()
);
export const applyFilter = createAction('[Shopping] Apply Filter', props<{ payload: { searchParameter: string } }>());
export const applyFilterSuccess = createAction(
  '[Shopping] Apply Filter Success',
  props<{ payload: { availableFilter: FilterNavigation; searchParameter: string } }>()
);
export const applyFilterFail = createAction('[Shopping] Apply Filter Fail', props<{ payload: { error: HttpError } }>());
export const loadProductsForFilter = createAction(
  '[Shopping] Load Products For Filter',
  props<{ payload: { id: ProductListingID; searchParameter: string } }>()
);
export const loadProductsForFilterFail = createAction(
  '[Shopping] Load Products For Filter Fail',
  props<{ payload: { error: HttpError } }>()
);
