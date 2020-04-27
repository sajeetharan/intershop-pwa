import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

export const searchProducts = createAction(
  '[Shopping] Search Products',
  props<{ payload: { searchTerm: string; page?: number; sorting?: string } }>()
);
export const searchProductsFail = createAction(
  '[Shopping] Search Products Fail',
  props<{ payload: { error: HttpError } }>()
);
export const suggestSearch = createAction(
  '[Suggest Search] Load Search Suggestions',
  props<{ payload: { searchTerm: string } }>()
);
export const suggestSearchSuccess = createAction(
  '[Suggest Search Internal] Return Search Suggestions',
  props<{ payload: { searchTerm: string; suggests: SuggestTerm[] } }>()
);
