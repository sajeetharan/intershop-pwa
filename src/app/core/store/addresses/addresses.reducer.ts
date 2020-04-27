import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import {
  createBasketAddress,
  createBasketAddressSuccess,
  deleteBasketShippingAddress,
  updateBasketAddress,
} from 'ish-core/store/checkout/basket';

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
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from './addresses.actions';

export const addressAdapter = createEntityAdapter<Address>({});

export interface AddressesState extends EntityState<Address> {
  loading: boolean;
  error: HttpError;
}

export const initialState: AddressesState = addressAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export function addressesReducer(state = initialState, action: Action): AddressesState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(
    deleteBasketShippingAddress,
    loadAddresses,
    createCustomerAddress,
    createBasketAddress,
    updateBasketAddress,
    deleteCustomerAddress,
    state => ({
      ...state,
      loading: true,
    })
  ),
  on(
    deleteCustomerAddressFail,
    loadAddressesFail,
    createCustomerAddressFail,
    updateCustomerAddressFail,
    (state, action) => {
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }
  ),
  on(loadAddressesSuccess, (state, action) => {
    const { addresses } = action.payload;

    return {
      ...addressAdapter.setAll(addresses, state),
      error: undefined,
      loading: false,
    };
  }),
  on(createBasketAddressSuccess, createCustomerAddressSuccess, (state, action) => {
    const { address } = action.payload;

    return {
      ...addressAdapter.addOne(address, state),
      loading: false,
      error: undefined,
    };
  }),
  on(updateCustomerAddressSuccess, (state, action) => {
    const { address } = action.payload;

    return {
      ...addressAdapter.updateOne({ id: address.id, changes: address }, state),
      loading: false,
      error: undefined,
    };
  }),
  on(deleteCustomerAddressSuccess, (state, action) => {
    const { addressId } = action.payload;

    return {
      ...addressAdapter.removeOne(addressId, state),
      loading: false,
      error: undefined,
    };
  }),
  on(resetAddresses, () => initialState)
);
