import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadOrder,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  resetOrders,
  selectOrder,
} from './orders.actions';

export const orderAdapter = createEntityAdapter<Order>({
  selectId: order => order.id,
});

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const initialState: OrdersState = orderAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export function ordersReducer(state = initialState, action: Action): OrdersState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(selectOrder, (state, action) => ({
    ...state,
    selected: action.payload.orderId,
  })),
  on(createOrder, loadOrders, loadOrder, state => ({
    ...state,
    loading: true,
  })),
  on(loadOrderSuccess, createOrderSuccess, (state, action) => {
    const { order } = action.payload;

    return {
      ...orderAdapter.upsertOne(order, state),
      selected: order.id,
      loading: false,
      error: undefined,
    };
  }),
  on(loadOrdersSuccess, (state, action) => {
    const { orders } = action.payload;
    return {
      ...orderAdapter.setAll(orders, state),
      loading: false,
      error: undefined,
    };
  }),
  on(createOrderFail, loadOrdersFail, loadOrderFail, (state, action) => {
    const { error } = action.payload;
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(resetOrders, () => initialState)
);
