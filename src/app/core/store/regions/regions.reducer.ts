import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Region } from 'ish-core/models/region/region.model';

import { loadRegions, loadRegionsFail, loadRegionsSuccess } from './regions.actions';

export const regionAdapter = createEntityAdapter<Region>({
  selectId: region => region.id,
});

export interface RegionsState extends EntityState<Region> {
  loading: boolean;
}

export const initialState: RegionsState = regionAdapter.getInitialState({
  loading: false,
});

export function regionsReducer(state = initialState, action: Action): RegionsState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(loadRegions, state => ({
    ...state,
    loading: true,
  })),
  on(loadRegionsFail, state => ({
    ...state,
    loading: false,
  })),
  on(loadRegionsSuccess, (state, action) => {
    const { regions } = action.payload;

    return {
      ...regionAdapter.upsertMany(regions, state),
      loading: false,
    };
  })
);
