import { Action, createReducer, on } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';

import {
  applyFilter,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
} from './filter.actions';

export interface FilterState {
  loading: boolean;
  availableFilter: FilterNavigation;
}

export const initialState: FilterState = {
  loading: false,
  availableFilter: undefined,
};

export function filterReducer(state = initialState, action: Action): FilterState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadFilterForSearch, loadFilterForCategory, () => ({ ...initialState, loading: true })),
  on(loadFilterSuccess, (state, action) => ({
    ...state,
    availableFilter: action.payload.filterNavigation,
    loading: false,
  })),
  on(loadFilterFail, state => ({
    ...state,
    availableFilter: undefined,
    loading: false,
  })),
  on(applyFilter, state => ({
    ...state,
    loading: true,
  })),
  on(applyFilterSuccess, (state, action) => {
    const { availableFilter } = action.payload;
    return {
      ...state,
      availableFilter,
      loading: false,
    };
  })
);
