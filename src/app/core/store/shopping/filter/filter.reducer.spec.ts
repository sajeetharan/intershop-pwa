import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
  loadProductsForFilter,
  loadProductsForFilterFail,
} from './filter.actions';
import { filterReducer, initialState } from './filter.reducer';

describe('Filter Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        | typeof loadFilterForCategory
        | typeof loadFilterSuccess
        | typeof loadFilterFail
        | typeof applyFilter
        | typeof applyFilterSuccess
        | typeof applyFilterFail
        | typeof loadFilterForSearch
        | typeof loadProductsForFilter
        | typeof loadProductsForFilterFail
      >;
      const state = filterReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadFilterForCategory', () => {
    it('should change state to loading when reduced', () => {
      const action = loadFilterForCategory({ payload: { uniqueId: 'dummy' } });
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('LoadFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filterNavigation = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = loadFilterSuccess({ payload: { filterNavigation } });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filterNavigation);
      expect(state.loading).toBeFalse();
    });
  });

  describe('LoadFilterFailed', () => {
    it('should set filter when reduced', () => {
      const action = loadFilterFail({ payload: { error: {} as HttpError } });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
      expect(state.loading).toBeFalse();
    });
  });

  describe('LoadFilterForSearch', () => {
    it('should change state to loading when reduced', () => {
      const action = loadFilterForSearch({ payload: { searchTerm: '' } });
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('LoadFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filterNavigation = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = loadFilterSuccess({ payload: { filterNavigation } });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filterNavigation);
      expect(state.loading).toBeFalse();
    });
  });

  describe('LoadFilterFailed', () => {
    it('should set filter when reduced', () => {
      const action = loadFilterFail({ payload: { error: {} as HttpError } });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toBeFalsy();
      expect(state.loading).toBeFalse();
    });
  });

  describe('ApplyFilter', () => {
    it('should change state to loading when reduced', () => {
      const action = applyFilter({ payload: { searchParameter: 'b' } });
      const state = filterReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });
  });

  describe('ApplyFilterSuccess', () => {
    it('should set filter when reduced', () => {
      const filter = { filter: [{ name: 'a' }] } as FilterNavigation;
      const action = applyFilterSuccess({
        payload: {
          availableFilter: filter,
          searchParameter: 'b',
        },
      });
      const state = filterReducer(initialState, action);

      expect(state.availableFilter).toEqual(filter);
      expect(state.loading).toBeFalse();
    });
  });
});
