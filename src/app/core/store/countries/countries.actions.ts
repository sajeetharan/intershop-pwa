import { createAction, props } from '@ngrx/store';

import { Country } from 'ish-core/models/country/country.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
export const loadCountries = createAction('[Core] Load Countries');
export const loadCountriesFail = createAction('[Core] Load Countries Fail', props<{ payload: { error: HttpError } }>());
export const loadCountriesSuccess = createAction(
  '[Core] Load Countries Success',
  props<{ payload: { countries: Country[] } }>()
);
