import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { PaymentService } from 'ish-core/services/payment/payment.service';
import { ofUrl, selectQueryParams } from 'ish-core/store/router';
import { getLoggedInCustomer } from 'ish-core/store/user';
import { mapErrorToActionV8, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPaymentEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private paymentService: PaymentService) {}

  loadBasketEligiblePaymentMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligiblePaymentMethods),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([, basketid]) =>
        this.paymentService.getBasketEligiblePaymentMethods(basketid).pipe(
          map(result => loadBasketEligiblePaymentMethodsSuccess({ payload: { paymentMethods: result } })),
          mapErrorToActionV8(loadBasketEligiblePaymentMethodsFail)
        )
      )
    )
  );
  setPaymentAtBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBasketPayment),
      mapToPayloadProperty('id'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([paymentInstrumentId, basketid]) =>
        this.paymentService.setBasketPayment(basketid, paymentInstrumentId).pipe(
          mapTo(setBasketPaymentSuccess()),
          mapErrorToActionV8(setBasketPaymentFail)
        )
      )
    )
  );
  createBasketPaymentInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasketPayment),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      map(([payload, customer]) => ({
        saveForLater: payload.saveForLater,
        paymentInstrument: payload.paymentInstrument,
        customerNo: customer && customer.customerNo,
      })),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([payload, basketid]) => {
        const createPayment$ =
          payload.customerNo && payload.saveForLater
            ? this.paymentService.createUserPayment(payload.customerNo, payload.paymentInstrument)
            : this.paymentService.createBasketPayment(basketid, payload.paymentInstrument);

        return createPayment$.pipe(
          concatMap(pi => [setBasketPayment({ payload: { id: pi.id } }), createBasketPaymentSuccess()]),
          mapErrorToActionV8(createBasketPaymentFail)
        );
      })
    )
  );
  sendPaymentRedirectData$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/\/checkout\/(payment|review).*/),
      select(selectQueryParams),
      // don't do anything in case of RedirectAfterCheckout
      filter(({ redirect, orderId }) => redirect && !orderId),
      switchMap(queryParams =>
        this.store.pipe(
          select(getCurrentBasketId),
          whenTruthy(),
          take(1),
          mapTo(updateBasketPayment({ payload: { params: queryParams } }))
        )
      )
    )
  );
  updateBasketPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketPayment),
      mapToPayloadProperty('params'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([params, basketid]) =>
        this.paymentService.updateBasketPayment(basketid, params).pipe(
          mapTo(updateBasketPaymentSuccess()),
          mapErrorToActionV8(updateBasketPaymentFail)
        )
      )
    )
  );
  deleteBasketPaymentInstrument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketPayment),
      mapToPayloadProperty('paymentInstrument'),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([paymentInstrument, basket]) =>
        this.paymentService.deleteBasketPaymentInstrument(basket, paymentInstrument).pipe(
          mapTo(deleteBasketPaymentSuccess()),
          mapErrorToActionV8(deleteBasketPaymentFail)
        )
      )
    )
  );
  loadBasketAfterBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBasketPaymentSuccess, setBasketPaymentFail, updateBasketPaymentSuccess, deleteBasketPaymentSuccess),
      mapTo(loadBasket())
    )
  );
  loadBasketEligiblePaymentMethodsAfterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketPaymentSuccess, createBasketPaymentSuccess),
      mapTo(loadBasketEligiblePaymentMethods())
    )
  );
}
