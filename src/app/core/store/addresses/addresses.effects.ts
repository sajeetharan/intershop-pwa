import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { toastMessage } from 'ish-core/store/messages';
import { getLoggedInCustomer, logoutUser } from 'ish-core/store/user';
import { mapErrorToActionV8, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  createCustomerAddress,
  createCustomerAddressFail,
  createCustomerAddressSuccess,
  deleteCustomerAddress,
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  loadAddresses,
  loadAddressesFail,
  loadAddressesSuccess,
  resetAddresses,
} from './addresses.actions';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressService: AddressService, private store: Store<{}>) {}

  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAddresses),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, customer]) =>
        this.addressService.getCustomerAddresses(customer.customerNo).pipe(
          map(addresses => loadAddressesSuccess({ payload: { addresses } })),
          mapErrorToActionV8(loadAddressesFail)
        )
      )
    )
  );
  createCustomerAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCustomerAddress),
      mapToPayloadProperty('address'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      filter(([address, customer]) => !!address || !!customer),
      concatMap(([address, customer]) =>
        this.addressService.createCustomerAddress(customer.customerNo, address).pipe(
          mergeMap(newAddress => [
            createCustomerAddressSuccess({ payload: { address: newAddress } }),
            toastMessage({
              payload: {
                message: 'account.addresses.new_address_created.message',
                messageType: 'success',
              },
            }),
          ]),
          mapErrorToActionV8(createCustomerAddressFail)
        )
      )
    )
  );
  deleteCustomerAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCustomerAddress),
      mapToPayloadProperty('addressId'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      filter(([addressId, customer]) => !!addressId || !!customer),
      mergeMap(([addressId, customer]) =>
        this.addressService.deleteCustomerAddress(customer.customerNo, addressId).pipe(
          mergeMap(id => [
            deleteCustomerAddressSuccess({ payload: { addressId: id } }),
            toastMessage({
              payload: { message: 'account.addresses.new_address_deleted.message', messageType: 'success' },
            }),
          ]),
          mapErrorToActionV8(deleteCustomerAddressFail)
        )
      )
    )
  );
  resetAddressesAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      mapTo(resetAddresses())
    )
  );
}
