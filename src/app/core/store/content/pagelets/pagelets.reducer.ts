import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { loadContentIncludeSuccess, resetContentIncludes } from 'ish-core/store/content/includes/includes.actions';
import { loadContentPageSuccess } from 'ish-core/store/content/pages/pages.actions';

export interface PageletsState extends EntityState<ContentPagelet> {}

export const pageletsAdapter = createEntityAdapter<ContentPagelet>();

export const initialState = pageletsAdapter.getInitialState();

export function pageletsReducer(state = initialState, action: Action) {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadContentIncludeSuccess, (state, action) => pageletsAdapter.upsertMany(action.payload.pagelets, state)),
  on(loadContentPageSuccess, (state, action) => pageletsAdapter.upsertMany(action.payload.pagelets, state)),
  on(resetContentIncludes, state => pageletsAdapter.removeAll(state))
);
