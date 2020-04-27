import { createAction, props } from '@ngrx/store';

import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';
export const loginUser = createAction('[Account] Login User', props<{ payload: { credentials: LoginCredentials } }>());
export const loginUserFail = createAction(
  '[Account API] Login User Failed',
  props<{ payload: { error: HttpError } }>()
);
export const loginUserSuccess = createAction(
  '[Account API] Login User Success',
  props<{ payload: CustomerUserType }>()
);
export const setAPIToken = createAction('[Account Internal] Set API Token', props<{ payload: { apiToken: string } }>());
export const resetAPIToken = createAction('[Account Internal] Reset API Token');
export const loadCompanyUser = createAction('[Account Internal] Load Company User');
export const loadCompanyUserFail = createAction(
  '[Account API] Load Company User Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadCompanyUserSuccess = createAction(
  '[Account API] Load Company User Success',
  props<{ payload: { user: User } }>()
);
export const logoutUser = createAction('[Account] Logout User');
export const createUser = createAction('[Account] Create User', props<{ payload: CustomerRegistrationType }>());
export const createUserFail = createAction(
  '[Account API] Create User Failed',
  props<{ payload: { error: HttpError } }>()
);
export const updateUser = createAction(
  '[Account] Update User',
  props<{ payload: { user: User; successMessage?: string; successRouterLink?: string } }>()
);
export const updateUserSuccess = createAction(
  '[Account API] Update User Succeeded',
  props<{ payload: { user: User; successMessage?: string } }>()
);
export const updateUserFail = createAction(
  '[Account API] Update User Failed',
  props<{ payload: { error: HttpError } }>()
);
export const updateUserPassword = createAction(
  '[Account] Update User Password',
  props<{ payload: { password: string; currentPassword: string; successMessage?: string } }>()
);
export const updateUserPasswordSuccess = createAction(
  '[Account API] Update User Password Succeeded',
  props<{ payload: { successMessage?: string } }>()
);
export const updateUserPasswordFail = createAction(
  '[Account API] Update User Password Failed',
  props<{ payload: { error: HttpError } }>()
);
export const updateCustomer = createAction(
  '[Account] Update Customer',
  props<{ payload: { customer: Customer; successMessage?: string; successRouterLink?: string } }>()
);
export const updateCustomerSuccess = createAction(
  '[Account API] Update Customer Succeeded',
  props<{ payload: { customer: Customer; successMessage?: string } }>()
);
export const updateCustomerFail = createAction(
  '[Account API] Update Customer Failed',
  props<{ payload: { error: HttpError } }>()
);
export const userErrorReset = createAction('[Account Internal] Reset User Error');
export const loadUserByAPIToken = createAction(
  '[Account] Load User by API Token',
  props<{ payload: { apiToken: string } }>()
);
export const setPGID = createAction('[Personalization Internal] Set PGID', props<{ payload: { pgid: string } }>());
export const loadUserPaymentMethods = createAction('[Account] Load User Payment Methods');
export const loadUserPaymentMethodsFail = createAction(
  '[Account API] Load User Payment Methods Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadUserPaymentMethodsSuccess = createAction(
  '[Account API] Load User Payment Methods Success',
  props<{ payload: { paymentMethods: PaymentMethod[] } }>()
);
export const deleteUserPaymentInstrument = createAction(
  '[Account] Delete User Instrument Payment ',
  props<{ payload: { id: string } }>()
);
export const deleteUserPaymentInstrumentFail = createAction(
  '[Account API] Delete User Payment Instrument Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteUserPaymentInstrumentSuccess = createAction('[Account API] Delete User Payment Instrument Success');
export const requestPasswordReminder = createAction(
  '[Password Reminder] Request Password Reminder',
  props<{ payload: { data: PasswordReminder } }>()
);
export const requestPasswordReminderSuccess = createAction('[Password Reminder API] Request Password Reminder Success');
export const requestPasswordReminderFail = createAction(
  '[Password Reminder API] Request Password Reminder Fail',
  props<{ payload: { error: HttpError } }>()
);
export const resetPasswordReminder = createAction('[Password Reminder Internal] Reset Password Reminder Data');
export const updateUserPasswordByPasswordReminder = createAction(
  '[Password Reminder] Update User Password',
  props<{ payload: { password: string; userID: string; secureCode: string } }>()
);
export const updateUserPasswordByPasswordReminderSuccess = createAction(
  '[Password Reminder] Update User Password Succeeded'
);
export const updateUserPasswordByPasswordReminderFail = createAction(
  '[Password Reminder] Update User Password Failed',
  props<{ payload: { error: HttpError } }>()
);
