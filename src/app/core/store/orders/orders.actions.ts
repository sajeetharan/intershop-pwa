import { Params } from '@angular/router';
import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
export const createOrder = createAction('[Order] Create Order', props<{ payload: { basketId: string } }>());
export const createOrderFail = createAction(
  '[Order API] Create Order Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createOrderSuccess = createAction(
  '[Order API] Create Order Success',
  props<{ payload: { order: Order } }>()
);
export const loadOrders = createAction('[Order] Load Orders');
export const loadOrdersFail = createAction('[Order API] Load Orders Fail', props<{ payload: { error: HttpError } }>());
export const loadOrdersSuccess = createAction(
  '[Order API] Load Orders Success',
  props<{ payload: { orders: Order[] } }>()
);
export const loadOrder = createAction('[Order] Load Order', props<{ payload: { orderId: string } }>());
export const loadOrderByAPIToken = createAction(
  '[Order Internal] Load Order using given API Token',
  props<{ payload: { apiToken: string; orderId: string } }>()
);
export const loadOrderFail = createAction('[Order API] Load Order Fail', props<{ payload: { error: HttpError } }>());
export const loadOrderSuccess = createAction('[Order API] Load Order Success', props<{ payload: { order: Order } }>());
export const selectOrder = createAction('[Order] Select Order', props<{ payload: { orderId: string } }>());
export const selectOrderAfterRedirect = createAction(
  '[Order Internal] Select Order After Checkout Redirect',
  props<{ payload: { params: Params } }>()
);
export const selectOrderAfterRedirectFail = createAction(
  '[Order API] Select Order Fail After Checkout Redirect',
  props<{ payload: { error: HttpError } }>()
);
export const resetOrders = createAction('[Order API] Reset Orders');
