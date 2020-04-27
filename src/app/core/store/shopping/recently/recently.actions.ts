import { createAction, props } from '@ngrx/store';
export const addToRecently = createAction(
  '[Recently Viewed] Add Product to Recently',
  props<{ payload: { sku: string; group?: string } }>()
);
export const clearRecently = createAction('[Recently Viewed] Clear Recently');
