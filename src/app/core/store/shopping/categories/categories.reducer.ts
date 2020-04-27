import { Action, createReducer, on } from '@ngrx/store';

import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';

import {
  loadCategory,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';

export interface CategoriesState {
  categories: CategoryTree;
  loading: boolean;
  topLevelLoaded: boolean;
}

export const initialState: CategoriesState = {
  loading: false,
  categories: CategoryTreeHelper.empty(),
  topLevelLoaded: false,
};

function mergeCategories(
  state: CategoriesState,
  action: ReturnType<typeof loadTopLevelCategoriesSuccess | typeof loadCategorySuccess>
) {
  const loadedTree = action.payload.categories;
  const categories = CategoryTreeHelper.merge(state.categories, loadedTree);
  return {
    ...state,
    categories,
    loading: false,
  };
}

export function categoriesReducer(state = initialState, action: Action): CategoriesState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadCategory, state => ({
    ...state,
    loading: true,
  })),
  on(loadCategoryFail, state => ({
    ...state,
    loading: false,
  })),
  on(loadTopLevelCategoriesSuccess, (state, action) => ({ ...mergeCategories(state, action), topLevelLoaded: true })),
  on(loadCategorySuccess, mergeCategories)
);
