import { Action, createReducer, on } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { setBreadcrumbData, setDeviceType, setStickyHeader } from './viewconf.actions';

export interface ViewconfState {
  breadcrumbData: BreadcrumbItem[];
  stickyHeader: boolean;
  // not synced via state transfer
  _deviceType: DeviceType;
}

export const initialState: ViewconfState = {
  breadcrumbData: [],
  stickyHeader: false,
  _deviceType: 'mobile',
};

export function viewconfReducer(state: ViewconfState = initialState, action: Action): ViewconfState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(setBreadcrumbData, (state, action) => ({
    ...state,
    breadcrumbData: action.payload.breadcrumbData,
  })),
  on(setDeviceType, (state, action) => ({
    ...state,
    _deviceType: action.payload.deviceType,
  })),
  on(setStickyHeader, (state, action) => ({
    ...state,
    stickyHeader: action.payload.sticky,
  }))
);
