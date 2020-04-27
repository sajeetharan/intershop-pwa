import { createAction, props } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
export const loadContentPage = createAction(
  '[Content Page] Load Content Page',
  props<{ payload: { contentPageId: string } }>()
);
export const loadContentPageFail = createAction(
  '[Content Page API] Load Content Page Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadContentPageSuccess = createAction(
  '[Content Page API] Load Content Page Success',
  props<{ payload: { page: ContentPageletEntryPoint; pagelets: ContentPagelet[] } }>()
);
export const resetContentPages = createAction('[Content Page] Reset Content Pages');
