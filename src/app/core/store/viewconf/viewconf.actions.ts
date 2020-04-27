import { createAction, props } from '@ngrx/store';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
export const setBreadcrumbData = createAction(
  '[Viewconf Internal] Set Breadcrumb Data',
  props<{ payload: { breadcrumbData: BreadcrumbItem[] } }>()
);
export const setDeviceType = createAction(
  '[Viewconf Internal] Set Device Type',
  props<{ payload: { deviceType: DeviceType } }>()
);
export const setStickyHeader = createAction(
  '[Viewconf Internal] Set Sticky Header',
  props<{ payload: { sticky: boolean } }>()
);
