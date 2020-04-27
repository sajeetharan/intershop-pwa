import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadOrder,
  loadOrderByAPIToken,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  resetOrders,
  selectOrder,
  selectOrderAfterRedirect,
  selectOrderAfterRedirectFail,
} from './orders.actions';
import { initialState, ordersReducer } from './orders.reducer';

describe('Orders Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        | typeof createOrder
        | typeof createOrderFail
        | typeof createOrderSuccess
        | typeof loadOrders
        | typeof loadOrdersFail
        | typeof loadOrdersSuccess
        | typeof loadOrder
        | typeof loadOrderByAPIToken
        | typeof loadOrderFail
        | typeof loadOrderSuccess
        | typeof selectOrder
        | typeof selectOrderAfterRedirect
        | typeof selectOrderAfterRedirectFail
        | typeof resetOrders
      >;
      const state = ordersReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('CreateOrder actions', () => {
    describe('CreateOrder action', () => {
      it('should set loading to true', () => {
        const action = createOrder({ payload: { basketId: BasketMockData.getBasket().id } });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateOrderSuccess action', () => {
      it('should add new order to initial state and select it', () => {
        const order = { id: 'orderid' } as Order;
        const action = createOrderSuccess({ payload: { order } });
        const state = ordersReducer(initialState, action);

        expect(state.entities[order.id]).toEqual(order);
        expect(state.selected).toEqual(order.id);
      });
    });

    describe('CreateOrderFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = createOrderFail({ payload: { error } });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });
  });

  describe('LoadOrders actions', () => {
    describe('LoadOrders action', () => {
      it('should set loading to true', () => {
        const action = loadOrders();
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrdersFail action', () => {
      it('should set loading to false', () => {
        const action = loadOrdersFail({ payload: { error: {} as HttpError } });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrdersSuccess action', () => {
      let orders: Order[];

      beforeEach(() => {
        orders = [
          {
            id: '1',
            documentNo: '0000001',
          } as Order,
          {
            id: '2',
            documentNo: '0000002',
          } as Order,
        ];
      });

      it('should insert orders if not exist', () => {
        const action = loadOrdersSuccess({ payload: { orders } });
        const state = ordersReducer(initialState, action);

        expect(state.ids).toHaveLength(2);
        expect(state.entities[orders[0].id].id).toEqual(orders[0].id);
      });
    });
  });

  describe('LoadOrder actions', () => {
    describe('LoadOrder action', () => {
      it('should set loading to true', () => {
        const action = loadOrder({ payload: { orderId: '12345' } });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrderFail action', () => {
      it('should set loading to false', () => {
        const action = loadOrdersFail({ payload: { error: {} as HttpError } });
        const state = ordersReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadOrderSuccess action', () => {
      let order: Order;

      beforeEach(() => {
        order = {
          id: '1',
          documentNo: '0000001',
        } as Order;
      });

      it('should insert order if not exist', () => {
        const action = loadOrderSuccess({ payload: { order } });
        const state = ordersReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[order.id]).toEqual(order);
      });
    });
  });

  describe('SelectOrder action', () => {
    it('should write the selected order to the state', () => {
      const order = { id: 'orderid' } as Order;
      const action = selectOrder({ payload: { orderId: order.id } });
      const state = ordersReducer(initialState, action);

      expect(state.selected).toEqual(order.id);
    });
  });

  describe('ResetOrders action', () => {
    it('should reset to initial state', () => {
      const oldState = {
        ...initialState,
        loading: true,
        orders: [{ ids: ['test'] }],
      };
      const action = resetOrders();
      const state = ordersReducer(oldState, action);

      expect(state).toEqual(initialState);
    });
  });
});
