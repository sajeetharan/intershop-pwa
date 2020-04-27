import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Country } from 'ish-core/models/country/country.model';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';

export const countryAdapter = createEntityAdapter<Country>({
  selectId: country => country.countryCode,
});

export interface CountriesState extends EntityState<Country> {
  loading: boolean;
}

export const initialState: CountriesState = countryAdapter.getInitialState({
  loading: false,
});

export function countriesReducer(state = initialState, action: Action): CountriesState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadCountries, state => ({
    ...state,
    loading: true,
  })),
  on(loadCountriesFail, state => ({
    ...state,
    loading: false,
  })),
  on(loadCountriesSuccess, (state, action) => {
    const { countries } = action.payload;

    return {
      ...countryAdapter.setAll(countries, state),
      loading: false,
    };
  })
);
