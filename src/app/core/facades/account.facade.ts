import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Contact } from 'ish-core/models/contact/contact.model';
import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { PasswordReminderUpdate } from 'ish-core/models/password-reminder-update/password-reminder-update.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { User } from 'ish-core/models/user/user.model';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getAddressesError,
  getAddressesLoading,
  getAllAddresses,
  loadAddresses,
} from 'ish-core/store/addresses';
import {
  createContact,
  getContactLoading,
  getContactSubjects,
  getContactSuccess,
  loadContact,
} from 'ish-core/store/contact/contact';
import { getOrders, getOrdersLoading, getSelectedOrder, loadOrders } from 'ish-core/store/orders';
import {
  createUser,
  deleteUserPaymentInstrument,
  getLoggedInCustomer,
  getLoggedInUser,
  getPasswordReminderError,
  getPasswordReminderSuccess,
  getUserAuthorized,
  getUserError,
  getUserLoading,
  getUserPaymentMethods,
  isBusinessCustomer,
  loadUserPaymentMethods,
  loginUser,
  requestPasswordReminder,
  resetPasswordReminder,
  updateCustomer,
  updateUser,
  updateUserPassword,
  updateUserPasswordByPasswordReminder,
} from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class AccountFacade {
  constructor(private store: Store<{}>) {}

  // USER
  user$ = this.store.pipe(select(getLoggedInUser));
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));
  isLoggedIn$ = this.store.pipe(select(getUserAuthorized));

  loginUser(credentials: LoginCredentials) {
    this.store.dispatch(loginUser({ payload: { credentials } }));
  }

  createUser(body: CustomerRegistrationType) {
    this.store.dispatch(createUser({ payload: body }));
  }

  updateUser(user: User, successMessage?: string, successRouterLink?: string) {
    this.store.dispatch(updateUser({ payload: { user, successMessage, successRouterLink } }));
  }

  updateUserEmail(user: User) {
    this.store.dispatch(
      updateUser({
        payload: {
          user,
          successMessage: 'account.profile.update_email.message',
          successRouterLink: '/account/profile',
        },
      })
    );
  }

  updateUserPassword(data: { password: string; currentPassword: string }) {
    this.store.dispatch(updateUserPassword({ payload: data }));
  }

  updateUserProfile(user: User) {
    this.store.dispatch(
      updateUser({
        payload: {
          user,
          successMessage: 'account.profile.update_profile.message',
          successRouterLink: '/account/profile',
        },
      })
    );
  }

  // CUSTOMER
  customer$ = this.store.pipe(select(getLoggedInCustomer));
  isBusinessCustomer$ = this.store.pipe(select(isBusinessCustomer));

  updateCustomerProfile(customer: Customer, message?: string) {
    this.store.dispatch(
      updateCustomer({
        payload: {
          customer,
          successMessage: message ? message : 'account.profile.update_profile.message',
          successRouterLink: '/account/profile',
        },
      })
    );
  }

  // PASSWORD
  passwordReminderSuccess$ = this.store.pipe(select(getPasswordReminderSuccess));
  passwordReminderError$ = this.store.pipe(select(getPasswordReminderError));

  resetPasswordReminder() {
    this.store.dispatch(resetPasswordReminder());
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.store.dispatch(requestPasswordReminder({ payload: { data } }));
  }

  requestPasswordReminderUpdate(data: PasswordReminderUpdate) {
    this.store.dispatch(updateUserPasswordByPasswordReminder({ payload: data }));
  }

  // ORDERS
  orders$() {
    this.store.dispatch(loadOrders());
    return this.store.pipe(select(getOrders));
  }

  selectedOrder$ = this.store.pipe(select(getSelectedOrder));
  ordersLoading$ = this.store.pipe(select(getOrdersLoading));

  // PAYMENT
  eligiblePaymentMethods$ = this.store.pipe(select(getUserPaymentMethods));

  paymentMethods$() {
    this.store.dispatch(loadUserPaymentMethods());
    return this.eligiblePaymentMethods$;
  }

  deletePaymentInstrument(paymentInstrumentId: string) {
    this.store.dispatch(deleteUserPaymentInstrument({ payload: { id: paymentInstrumentId } }));
  }

  // ADDRESSES
  addresses$() {
    return this.user$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadAddresses())),
      switchMap(() => this.store.pipe(select(getAllAddresses)))
    );
  }
  addressesLoading$ = this.store.pipe(select(getAddressesLoading));
  addressesError$ = this.store.pipe(select(getAddressesError));

  createCustomerAddress(address: Address) {
    this.store.dispatch(createCustomerAddress({ payload: { address } }));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(deleteCustomerAddress({ payload: { addressId } }));
  }

  // CONTACT US
  contactSubjects$() {
    this.store.dispatch(loadContact());
    return this.store.pipe(select(getContactSubjects));
  }
  contactLoading$ = this.store.pipe(select(getContactLoading));
  contactSuccess$ = this.store.pipe(select(getContactSuccess));

  resetContactState() {
    this.store.dispatch(loadContact());
  }
  createContact(contact: Contact) {
    this.store.dispatch(createContact({ payload: { contact } }));
  }
}
