import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Region } from 'ish-core/models/region/region.model';
export const loadRegions = createAction('[Core] Load Regions', props<{ payload: { countryCode: string } }>());
export const loadRegionsFail = createAction('[Core] Load Regions Fail', props<{ payload: { error: HttpError } }>());
export const loadRegionsSuccess = createAction(
  '[Core] Load Regions Success',
  props<{ payload: { regions: Region[] } }>()
);
