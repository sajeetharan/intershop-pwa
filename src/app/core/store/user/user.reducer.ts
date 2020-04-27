import { Action, createReducer, on } from '@ngrx/store';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

import {
  createUser,
  createUserFail,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  loadCompanyUser,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUser,
  loginUserFail,
  loginUserSuccess,
  logoutUser,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  resetAPIToken,
  resetPasswordReminder,
  setAPIToken,
  setPGID,
  updateCustomer,
  updateCustomerFail,
  updateCustomerSuccess,
  updateUser,
  updateUserFail,
  updateUserPassword,
  updateUserPasswordByPasswordReminder,
  updateUserPasswordByPasswordReminderFail,
  updateUserPasswordByPasswordReminderSuccess,
  updateUserPasswordFail,
  updateUserPasswordSuccess,
  updateUserSuccess,
  userErrorReset,
} from './user.actions';

export interface UserState {
  customer: Customer;
  user: User;
  authorized: boolean;
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: HttpError;
  pgid: string;
  passwordReminderSuccess: boolean;
  passwordReminderError: HttpError;
  // not synced via state transfer
  _authToken: string;
  _lastAuthTokenBeforeLogin: string;
}

export const initialState: UserState = {
  customer: undefined,
  user: undefined,
  authorized: false,
  paymentMethods: undefined,
  loading: false,
  error: undefined,
  pgid: undefined,
  passwordReminderSuccess: undefined,
  passwordReminderError: undefined,
  _authToken: undefined,
  _lastAuthTokenBeforeLogin: undefined,
};

export function userReducer(state = initialState, action: Action): UserState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(userErrorReset, state => ({
    ...state,
    error: undefined,
  })),
  on(loginUser, state => ({
    ...initialState,
    _authToken: state._authToken,
    _lastAuthTokenBeforeLogin: state._authToken,
  })),
  on(logoutUser, () => initialState),
  on(setAPIToken, (state, action) => ({
    ...state,
    _authToken: action.payload.apiToken,
  })),
  on(resetAPIToken, state => ({
    ...state,
    _authToken: undefined,
  })),
  on(
    deleteUserPaymentInstrument,
    loadCompanyUser,
    createUser,
    updateUser,
    updateUserPassword,
    updateCustomer,
    loadUserPaymentMethods,
    state => ({
      ...state,
      loading: true,
    })
  ),
  on(createUserFail, loginUserFail, loadCompanyUserFail, (state, action) => {
    const error = action.payload.error;

    return {
      ...initialState,
      loading: false,
      error,
      _authToken: state._authToken,
    };
  }),
  on(
    deleteUserPaymentInstrumentFail,
    updateUserFail,
    updateUserPasswordFail,
    updateCustomerFail,
    loadUserPaymentMethodsFail,
    (state, action) => {
      const error = action.payload.error;

      return {
        ...state,
        loading: false,
        error,
      };
    }
  ),
  on(loginUserSuccess, (state, action) => {
    const customer = action.payload.customer;
    const user = action.payload.user;

    return {
      ...state,
      authorized: true,
      customer,
      user,
      loading: false,
      error: undefined,
    };
  }),
  on(loadCompanyUserSuccess, (state, action) => {
    const user = action.payload.user;

    return {
      ...state,
      user,
      loading: false,
      error: undefined,
    };
  }),
  on(updateUserSuccess, (state, action) => {
    const user = action.payload.user;

    return {
      ...state,
      user,
      loading: false,
      error: undefined,
    };
  }),
  on(updateUserPasswordSuccess, state => ({
    ...state,
    loading: false,
    error: undefined,
  })),
  on(updateCustomerSuccess, (state, action) => {
    const customer = action.payload.customer;

    return {
      ...state,
      customer,
      loading: false,
      error: undefined,
    };
  }),
  on(setPGID, (state, action) => ({
    ...state,
    pgid: action.payload.pgid,
  })),
  on(loadUserPaymentMethodsSuccess, (state, action) => ({
    ...state,
    paymentMethods: action.payload.paymentMethods,
    loading: false,
    error: undefined,
  })),
  on(deleteUserPaymentInstrumentSuccess, state => ({
    ...state,
    loading: false,
    error: undefined,
  })),
  on(requestPasswordReminder, updateUserPasswordByPasswordReminder, state => ({
    ...state,
    loading: true,
    passwordReminderSuccess: undefined,
    passwordReminderError: undefined,
  })),
  on(requestPasswordReminderSuccess, updateUserPasswordByPasswordReminderSuccess, state => ({
    ...state,
    loading: false,
    passwordReminderSuccess: true,
    passwordReminderError: undefined,
  })),
  on(requestPasswordReminderFail, updateUserPasswordByPasswordReminderFail, (state, action) => ({
    ...state,
    loading: false,
    passwordReminderSuccess: false,
    passwordReminderError: action.payload.error,
  })),
  on(resetPasswordReminder, state => ({
    ...state,
    passwordReminderSuccess: undefined,
    passwordReminderError: undefined,
  }))
);
