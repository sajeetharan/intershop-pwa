import { Action, createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { generalError, serverError, timeoutError } from './error.actions';

export interface ErrorState {
  current: HttpError;
  type: string;
}

export const initialState: ErrorState = {
  current: undefined,
  type: undefined,
};

export function errorReducer(state = initialState, action: Action): ErrorState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(timeoutError, generalError, serverError, (state, action) => ({
    ...state,
    current: action.payload.error,
    type: action.type,
  }))
);
