import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';

import {
  loadContentInclude,
  loadContentIncludeFail,
  loadContentIncludeSuccess,
  resetContentIncludes,
} from './includes.actions';

export const includesAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: contentInclude => contentInclude.id,
});

export interface IncludesState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
}

export const initialState: IncludesState = includesAdapter.getInitialState({
  loading: false,
});

export function includesReducer(state = initialState, action: Action): IncludesState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadContentInclude, state => ({
    ...state,
    loading: true,
  })),
  on(loadContentIncludeFail, state => ({
    ...state,
    loading: false,
  })),
  on(loadContentIncludeSuccess, (state, action) => {
    const { include } = action.payload;

    return {
      ...includesAdapter.upsertOne(include, state),
      loading: false,
    };
  }),
  on(resetContentIncludes, state => ({
    ...includesAdapter.removeAll(state),
    loading: false,
  }))
);
