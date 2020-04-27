import { Action, createReducer, on } from '@ngrx/store';

import { setSentryConfig } from './sentry-config.actions';

export interface SentryConfigState {
  dsn: string;
}

export const initialState: SentryConfigState = {
  dsn: undefined,
};

export function sentryConfigReducer(state = initialState, action: Action): SentryConfigState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(setSentryConfig, (state, action) => ({
    ...state,
    ...action.payload,
  }))
);
