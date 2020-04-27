import { TestBed } from '@angular/core/testing';

import { Country } from 'ish-core/models/country/country.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';
import { getAllCountries, getCountriesLoading } from './countries.selectors';

describe('Countries Selectors', () => {
  let store$: TestStore;

  const countries = [{ countryCode: 'BG', name: 'Bulgaria' }, { countryCode: 'DE', name: 'Germany' }] as Country[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ reducers: coreReducers }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any countries when used', () => {
      expect(getAllCountries(store$.state)).toBeEmpty();
      expect(getCountriesLoading(store$.state)).toBeFalse();
    });
  });

  describe('loading countries', () => {
    beforeEach(() => {
      store$.dispatch(loadCountries());
    });

    it('should set the state to loading', () => {
      expect(getCountriesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadCountriesSuccess({ payload: { countries } }));
      });

      it('should set loading to false', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toEqual(countries);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadCountriesFail({ payload: { error: { message: 'error' } as HttpError } }));
      });

      it('should not have loaded category on error', () => {
        expect(getCountriesLoading(store$.state)).toBeFalse();
        expect(getAllCountries(store$.state)).toBeEmpty();
      });
    });
  });
});
