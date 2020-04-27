import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMapTo, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService, BasketUpdateType } from 'ish-core/services/basket/basket.service';
import {
  createCustomerAddressFail,
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from 'ish-core/store/addresses';
import { getLoggedInCustomer } from 'ish-core/store/user';
import { mapErrorToActionV8, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  assignBasketAddress,
  createBasketAddress,
  createBasketAddressSuccess,
  deleteBasketShippingAddress,
  loadBasket,
  resetBasketErrors,
  updateBasket,
  updateBasketAddress,
} from './basket.actions';

@Injectable()
export class BasketAddressesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private basketService: BasketService,
    private addressService: AddressService
  ) {}

  createAddressForBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasketAddress),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),

      mergeMap(([action, customer]) => {
        // create address at customer for logged in user
        if (customer) {
          return this.addressService.createCustomerAddress('-', action.payload.address).pipe(
            map(newAddress =>
              createBasketAddressSuccess({ payload: { address: newAddress, scope: action.payload.scope } })
            ),
            mapErrorToActionV8(createCustomerAddressFail)
          );
          // create address at basket for anonymous user
        } else {
          return this.basketService.createBasketAddress('current', action.payload.address).pipe(
            map(newAddress =>
              createBasketAddressSuccess({ payload: { address: newAddress, scope: action.payload.scope } })
            ),
            mapErrorToActionV8(createCustomerAddressFail)
          );
        }
      })
    )
  );
  assignNewAddressToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasketAddressSuccess),
      map(action =>
        assignBasketAddress({
          payload: {
            addressId: action.payload.address.id,
            scope: action.payload.scope,
          },
        })
      )
    )
  );
  assignBasketAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignBasketAddress),
      mapToPayload(),
      map(payload => {
        let body: BasketUpdateType;
        switch (payload.scope) {
          case 'invoice': {
            body = { invoiceToAddress: payload.addressId };
            break;
          }
          case 'shipping': {
            body = { commonShipToAddress: payload.addressId };
            break;
          }
          case 'any': {
            body = { invoiceToAddress: payload.addressId, commonShipToAddress: payload.addressId };
            break;
          }
        }

        return updateBasket({ payload: { update: body } });
      })
    )
  );
  updateBasketAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketAddress),
      mapToPayloadProperty('address'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      mergeMap(([address, customer]) => {
        // create address at customer for logged in user
        if (customer) {
          return this.addressService.updateCustomerAddress('-', address).pipe(
            concatMapTo([updateCustomerAddressSuccess({ payload: { address } }), loadBasket(), resetBasketErrors()]),
            mapErrorToActionV8(updateCustomerAddressFail)
          );
          // create address at basket for anonymous user
        } else {
          return this.basketService.updateBasketAddress('current', address).pipe(
            concatMapTo([updateCustomerAddressSuccess({ payload: { address } }), loadBasket(), resetBasketErrors()]),
            mapErrorToActionV8(updateCustomerAddressFail)
          );
        }
      })
    )
  );
  deleteBasketShippingAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketShippingAddress),
      mapToPayloadProperty('addressId'),
      mergeMap(addressId =>
        this.addressService.deleteCustomerAddress('-', addressId).pipe(
          concatMapTo([deleteCustomerAddressSuccess({ payload: { addressId } }), loadBasket()]),
          mapErrorToActionV8(deleteCustomerAddressFail)
        )
      )
    )
  );
}
