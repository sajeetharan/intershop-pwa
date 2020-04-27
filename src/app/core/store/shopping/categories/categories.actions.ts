import { createAction, props } from '@ngrx/store';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
export const loadTopLevelCategories = createAction(
  '[Shopping] Load top level categories',
  props<{ payload: { depth: number } }>()
);
export const loadTopLevelCategoriesFail = createAction(
  '[Shopping] Load top level categories fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadTopLevelCategoriesSuccess = createAction(
  '[Shopping] Load top level categories success',
  props<{ payload: { categories: CategoryTree } }>()
);
export const loadCategory = createAction('[Shopping] Load Category', props<{ payload: { categoryId: string } }>());
export const loadCategoryFail = createAction(
  '[Shopping] Load Category Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadCategorySuccess = createAction(
  '[Shopping] Load Category Success',
  props<{ payload: { categories: CategoryTree } }>()
);
