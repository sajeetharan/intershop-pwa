import { Action, createReducer, on } from '@ngrx/store';

import { addToRecently, clearRecently } from './recently.actions';

export interface RecentlyState {
  products: { sku: string; group?: string }[];
}

export const initialState: RecentlyState = {
  products: [],
};

export function recentlyReducer(state = initialState, action: Action): RecentlyState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(addToRecently, (state, action) => {
    const products = [action.payload, ...state.products];

    return { ...state, products };
  }),
  on(clearRecently, state => {
    const products = [];

    return { ...state, products };
  })
);
