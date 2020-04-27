import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

import { suggestSearchSuccess } from './search.actions';

export interface SuggestSearch {
  searchTerm: string;
  suggests: SuggestTerm[];
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.searchTerm,
});

export interface SearchState extends EntityState<SuggestSearch> {}

export const initialState: SearchState = searchAdapter.getInitialState({});

export function searchReducer(state = initialState, action: Action): SearchState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(suggestSearchSuccess, (state, action) => searchAdapter.upsertOne(action.payload, state))
);
