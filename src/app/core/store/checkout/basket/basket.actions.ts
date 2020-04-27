import { Params } from '@angular/router';
import { createAction, props } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidation, BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { BasketUpdateType } from 'ish-core/services/basket/basket.service';
/* payload: Shipping Method Id */
export const loadBasket = createAction('[Basket Internal] Load Basket');
export const loadBasketByAPIToken = createAction(
  '[Basket Internal] Load Basket by API Token',
  props<{ payload: { apiToken: string } }>()
);
export const loadBasketFail = createAction('[Basket API] Load Basket Fail', props<{ payload: { error: HttpError } }>());
export const loadBasketSuccess = createAction(
  '[Basket API] Load Basket Success',
  props<{ payload: { basket: Basket } }>()
);
export const createBasketAddress = createAction(
  '[Basket] Create Basket Address',
  props<{ payload: { address: Address; scope: 'invoice' | 'shipping' | 'any' } }>()
);
export const createBasketAddressSuccess = createAction(
  '[Basket Internal] Create Basket Address Success',
  props<{ payload: { address: Address; scope: 'invoice' | 'shipping' | 'any' } }>()
);
export const assignBasketAddress = createAction(
  '[Basket] Assign an Address to the Basket',
  props<{ payload: { addressId: string; scope: 'invoice' | 'shipping' | 'any' } }>()
);
export const updateBasketAddress = createAction(
  '[Basket] Update an Address at Basket',
  props<{ payload: { address: Address } }>()
);
export const updateBasketShippingMethod = createAction(
  '[Basket] Update Baskets Shipping Method',
  props<{ payload: { shippingId: string } }>()
);
export const updateBasket = createAction(
  '[Basket Internal] Update Basket',
  props<{ payload: { update: BasketUpdateType } }>()
);
export const updateBasketFail = createAction(
  '[Basket API] Update Basket Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteBasketShippingAddress = createAction(
  '[Basket] Delete Basket Shipping Address',
  props<{ payload: { addressId: string } }>()
);
export const addProductToBasket = createAction(
  '[Basket] Add Product',
  props<{ payload: { sku: string; quantity: number } }>()
);
export const addItemsToBasket = createAction(
  '[Basket Internal] Add Items To Basket',
  props<{ payload: { items: { sku: string; quantity: number; unit: string }[]; basketId?: string } }>()
);
export const addItemsToBasketFail = createAction(
  '[Basket API] Add Items To Basket Fail',
  props<{ payload: { error: HttpError } }>()
);
export const addItemsToBasketSuccess = createAction(
  '[Basket API] Add Items To Basket Success',
  props<{ payload: { info: BasketInfo[] } }>()
);
export const mergeBasket = createAction('[Basket Internal] Merge two baskets');
export const mergeBasketFail = createAction(
  '[Basket API] Merge two baskets Fail',
  props<{ payload: { error: HttpError } }>()
);
export const mergeBasketSuccess = createAction(
  '[Basket API] Merge two baskets Success',
  props<{ payload: { basket: Basket } }>()
);
export const validateBasket = createAction(
  '[Basket] Validate Basket',
  props<{ payload: { scopes: BasketValidationScopeType[] } }>()
);
export const continueCheckout = createAction(
  '[Basket] Validate Basket and continue checkout',
  props<{ payload: { targetStep: number } }>()
);
export const continueCheckoutFail = createAction(
  '[Basket API] Validate Basket and continue checkout Fail',
  props<{ payload: { error: HttpError } }>()
);
export const continueCheckoutSuccess = createAction(
  '[Basket API] Validate Basket and continue with success',
  props<{ payload: { targetRoute: string; basketValidation: BasketValidation } }>()
);
export const continueCheckoutWithIssues = createAction(
  '[Basket API] Validate Basket and continue with issues',
  props<{ payload: { targetRoute: string; basketValidation: BasketValidation } }>()
);
export const updateBasketItems = createAction(
  '[Basket] Update Basket Items',
  props<{ payload: { lineItemUpdates: LineItemUpdate[] } }>()
);
export const updateBasketItemsFail = createAction(
  '[Basket API] Update Basket Items Fail',
  props<{ payload: { error: HttpError } }>()
);
export const updateBasketItemsSuccess = createAction(
  '[Basket API] Update Basket Items Success',
  props<{ payload: { info: BasketInfo[] } }>()
);
export const deleteBasketItem = createAction('[Basket] Delete Basket Item', props<{ payload: { itemId: string } }>());
export const deleteBasketItemFail = createAction(
  '[Basket API] Delete Basket Item Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteBasketItemSuccess = createAction(
  '[Basket API] Delete Basket Item Success',
  props<{ payload: { info: BasketInfo[] } }>()
);
export const removePromotionCodeFromBasket = createAction(
  '[Basket Internal] Remove Promotion Code From Basket',
  props<{ payload: { code: string } }>()
);
export const removePromotionCodeFromBasketFail = createAction(
  '[Basket API] Remove Promotion Code From Basket Fail',
  props<{ payload: { error: HttpError } }>()
);
export const removePromotionCodeFromBasketSuccess = createAction(
  '[Basket API] Remove Promotion Code From Basket Success'
);
export const addPromotionCodeToBasket = createAction(
  '[Basket Internal] Add Promotion Code To Basket',
  props<{ payload: { code: string } }>()
);
export const addPromotionCodeToBasketFail = createAction(
  '[Basket API] Add Promotion Code To Basket Fail',
  props<{ payload: { error: HttpError } }>()
);
export const addPromotionCodeToBasketSuccess = createAction('[Basket API] Add Promotion Code To Basket Success');
export const loadBasketEligibleShippingMethods = createAction('[Basket] Load Basket Eligible Shipping Methods');
export const loadBasketEligibleShippingMethodsFail = createAction(
  '[Basket API] Load Basket Eligible Shipping Methods Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadBasketEligibleShippingMethodsSuccess = createAction(
  '[Basket API] Load Basket Eligible Shipping Methods Success',
  props<{ payload: { shippingMethods: ShippingMethod[] } }>()
);
export const loadBasketEligiblePaymentMethods = createAction('[Basket] Load Basket Eligible Payment Methods');
export const loadBasketEligiblePaymentMethodsFail = createAction(
  '[Basket API] Load Basket Eligible Payment Methods Fail',
  props<{ payload: { error: HttpError } }>()
);
export const loadBasketEligiblePaymentMethodsSuccess = createAction(
  '[Basket API] Load Basket Eligible Payment Methods Success',
  props<{ payload: { paymentMethods: PaymentMethod[] } }>()
);
export const setBasketPayment = createAction('[Basket] Set a Payment at Basket ', props<{ payload: { id: string } }>());
export const setBasketPaymentFail = createAction(
  '[Basket API] Set a Payment at Basket Fail',
  props<{ payload: { error: HttpError } }>()
);
export const setBasketPaymentSuccess = createAction('[Basket API] Set a Payment at Basket Success');
export const createBasketPayment = createAction(
  '[Basket] Create a Basket Payment',
  props<{ payload: { paymentInstrument: PaymentInstrument; saveForLater: boolean } }>()
);
export const createBasketPaymentFail = createAction(
  '[Basket API] Create a Basket Payment Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createBasketPaymentSuccess = createAction('[Basket API] Create a Basket Payment Success');
export const updateBasketPayment = createAction(
  '[Basket] Update a Basket Payment with Redirect Data',
  props<{ payload: { params: Params } }>()
);
export const updateBasketPaymentFail = createAction(
  '[Basket API] Update a Basket Payment Fail',
  props<{ payload: { error: HttpError } }>()
);
export const updateBasketPaymentSuccess = createAction('[Basket API] Update a Basket Payment Success');
export const deleteBasketPayment = createAction(
  '[Basket] Delete Basket Payment',
  props<{ payload: { paymentInstrument: PaymentInstrument } }>()
);
export const deleteBasketPaymentFail = createAction(
  '[Basket API] Delete Basket Payment Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteBasketPaymentSuccess = createAction('[Basket API] Delete Basket Payment Success');
export const resetBasket = createAction('[Basket Internal] Reset Basket');
export const resetBasketErrors = createAction('[Basket Internal] Reset Basket and Basket Promotion Errors');
