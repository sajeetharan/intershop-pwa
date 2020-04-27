import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';

import { loadContentPage, loadContentPageFail, loadContentPageSuccess, resetContentPages } from './pages.actions';

export const pagesAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: contentPage => contentPage.id,
});

export interface PagesState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
}

export const initialState: PagesState = pagesAdapter.getInitialState({
  loading: false,
});

export function pagesReducer(state = initialState, action: Action): PagesState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadContentPage, state => ({
    ...state,
    loading: true,
  })),
  on(loadContentPageFail, state => ({
    ...state,
    loading: false,
  })),
  on(loadContentPageSuccess, (state, action) => {
    const { page } = action.payload;

    return {
      ...pagesAdapter.upsertOne(page, state),
      loading: false,
    };
  }),
  on(resetContentPages, state => ({
    ...pagesAdapter.removeAll(state),
    loading: false,
  }))
);
