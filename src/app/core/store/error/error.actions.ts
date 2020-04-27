import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
// 500
export const generalError = createAction('[Error] Communication Error', props<{ payload: { error: HttpError } }>());
export const timeoutError = createAction(
  '[Error] Communication Timeout Error',
  props<{ payload: { error: HttpError } }>()
);
export const serverError = createAction('[Error] Server Error (5xx)', props<{ payload: { error: HttpError } }>());
