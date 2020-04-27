import { createAction, props } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
export const loadContentInclude = createAction(
  '[Content Include] Load Content Include',
  props<{ payload: { includeId: string } }>()
);
export const loadContentIncludeFail = createAction(
  '[Content Include API] Load Content Include Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadContentIncludeSuccess = createAction(
  '[Content Include API] Load Content Include Success',
  props<{ payload: { include: ContentPageletEntryPoint; pagelets: ContentPagelet[] } }>()
);
export const resetContentIncludes = createAction('[Content Include] Reset Content Includes');
