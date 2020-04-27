import { createAction, props } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
export const loadAddresses = createAction('[Address Internal] Load Addresses');
export const loadAddressesFail = createAction(
  '[Address API] Load Addresses Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadAddressesSuccess = createAction(
  '[Address API] Load Addresses Success',
  props<{ payload: { addresses: Address[] } }>()
);
export const createCustomerAddress = createAction(
  '[Address] Create Customer Address',
  props<{ payload: { address: Address } }>()
);
export const createCustomerAddressFail = createAction(
  '[Address API] Create Customer Address Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createCustomerAddressSuccess = createAction(
  '[Address API] Create Customer Address Success',
  props<{ payload: { address: Address } }>()
);
export const updateCustomerAddressFail = createAction(
  '[Address API] Update Customer Address Fail',
  props<{ payload: { error: HttpError } }>()
);
export const updateCustomerAddressSuccess = createAction(
  '[Address API] Update Customer Address Success',
  props<{ payload: { address: Address } }>()
);
export const deleteCustomerAddress = createAction(
  '[Address] Delete Customer Address',
  props<{ payload: { addressId: string } }>()
);
export const deleteCustomerAddressFail = createAction(
  '[Address API] Delete Customer Address Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteCustomerAddressSuccess = createAction(
  '[Address API] Delete Customer Address Success',
  props<{ payload: { addressId: string } }>()
);
export const resetAddresses = createAction('[Address Internal] Reset Addresses');
