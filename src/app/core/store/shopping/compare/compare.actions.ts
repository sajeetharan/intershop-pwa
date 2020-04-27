import { createAction, props } from '@ngrx/store';
export const addToCompare = createAction('[Shopping] Add Product to Compare', props<{ payload: { sku: string } }>());
export const removeFromCompare = createAction(
  '[Shopping] Remove Product from Compare',
  props<{ payload: { sku: string } }>()
);
export const toggleCompare = createAction('[Shopping] Toggle Product Compare', props<{ payload: { sku: string } }>());
