import { Action, createReducer, on } from '@ngrx/store';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { createOrderSuccess } from 'ish-core/store/orders';

import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  assignBasketAddress,
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  mergeBasket,
  mergeBasketFail,
  mergeBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
  resetBasket,
  resetBasketErrors,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  updateBasket,
  updateBasketFail,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
  updateBasketShippingMethod,
} from './basket.actions';

export interface BasketState {
  basket: Basket;
  eligibleShippingMethods: ShippingMethod[];
  eligiblePaymentMethods: PaymentMethod[];
  loading: boolean;
  promotionError: HttpError; // for promotion-errors
  error: HttpError; // add, update and delete errors
  info: BasketInfo[];
  lastTimeProductAdded: number;
  validationResults: BasketValidationResultType;
}

const initialValidationResults: BasketValidationResultType = {
  valid: undefined,
  adjusted: undefined,
  errors: [],
};

export const initialState: BasketState = {
  basket: undefined,
  eligibleShippingMethods: undefined,
  eligiblePaymentMethods: undefined,
  loading: false,
  error: undefined,
  info: undefined,
  promotionError: undefined,
  lastTimeProductAdded: undefined,
  validationResults: initialValidationResults,
};

export function basketReducer(state = initialState, action: Action): BasketState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(
    loadBasket,
    assignBasketAddress,
    updateBasketShippingMethod,
    updateBasket,
    addProductToBasket,
    addPromotionCodeToBasket,
    removePromotionCodeFromBasket,
    addItemsToBasket,
    mergeBasket,
    continueCheckout,
    state => ({
      ...state,
      loading: true,
    })
  ),
  on(
    deleteBasketPayment,
    updateBasketItems,
    deleteBasketItem,
    loadBasketEligibleShippingMethods,
    loadBasketEligiblePaymentMethods,
    setBasketPayment,
    createBasketPayment,
    updateBasketPayment,
    state => ({
      ...state,
      loading: true,
    })
  ),
  on(
    mergeBasketFail,
    loadBasketFail,
    updateBasketFail,
    continueCheckoutFail,
    addItemsToBasketFail,
    removePromotionCodeFromBasketFail,
    updateBasketItemsFail,
    deleteBasketItemFail,
    loadBasketEligibleShippingMethodsFail,
    loadBasketEligiblePaymentMethodsFail,
    (state, action) => {
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }
  ),
  on(
    deleteBasketPaymentFail,
    setBasketPaymentFail,
    createBasketPaymentFail,
    updateBasketPaymentFail,
    (state, action) => {
      const { error } = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }
  ),
  on(addPromotionCodeToBasketFail, (state, action) => {
    const { error } = action.payload;

    return {
      ...state,
      promotionError: error,
      loading: false,
    };
  }),
  on(addPromotionCodeToBasketSuccess, state => ({
    ...state,
    loading: false,
    promotionError: undefined,
  })),
  on(deleteBasketItemSuccess, updateBasketItemsSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: undefined,
    info: action.payload.info,
    validationResults: initialValidationResults,
  })),
  on(
    deleteBasketPaymentSuccess,
    removePromotionCodeFromBasketSuccess,
    setBasketPaymentSuccess,
    createBasketPaymentSuccess,
    updateBasketPaymentSuccess,
    state => ({
      ...state,
      loading: false,
      error: undefined,
      validationResults: initialValidationResults,
    })
  ),
  on(addItemsToBasketSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: undefined,
    info: action.payload.info,
    lastTimeProductAdded: new Date().getTime(),
  })),
  on(loadBasketSuccess, mergeBasketSuccess, (state, action) => {
    const basket = {
      ...action.payload.basket,
    };

    return {
      ...state,
      basket,
      loading: false,
      error: undefined,
    };
  }),
  on(continueCheckoutWithIssues, continueCheckoutSuccess, (state, action) => {
    const validation = action.payload.basketValidation;
    const basket = validation && validation.results.adjusted && validation.basket ? validation.basket : state.basket;

    return {
      ...state,
      basket,
      loading: false,
      error: undefined,
      info: undefined,
      validationResults: validation && validation.results,
    };
  }),
  on(loadBasketEligibleShippingMethodsSuccess, (state, action) => ({
    ...state,
    eligibleShippingMethods: action.payload.shippingMethods,
    loading: false,
    error: undefined,
  })),
  on(loadBasketEligiblePaymentMethodsSuccess, (state, action) => ({
    ...state,
    eligiblePaymentMethods: action.payload.paymentMethods,
    loading: false,
    error: undefined,
  })),
  on(createOrderSuccess, resetBasket, () => initialState),
  on(resetBasketErrors, state => ({
    ...state,
    error: undefined,
    info: undefined,
    promotionError: undefined,
    validationResults: initialValidationResults,
  }))
);
