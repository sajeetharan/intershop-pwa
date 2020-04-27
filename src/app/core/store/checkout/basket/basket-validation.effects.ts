import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, tap, withLatestFrom } from 'rxjs/operators';

import {
  BasketValidationResultType,
  BasketValidationScopeType,
} from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { createOrder } from 'ish-core/store/orders';
import { loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToActionV8, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  loadBasketEligiblePaymentMethods,
  loadBasketEligibleShippingMethods,
  validateBasket,
} from './basket.actions';
import { getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketValidationEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<{}>,
    private basketService: BasketService
  ) {}

  validateBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(validateBasket),
      mapToPayloadProperty('scopes'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      whenTruthy(),
      concatMap(([scopes, basketId]) =>
        this.basketService.validateBasket(basketId, scopes).pipe(
          map(basketValidation =>
            basketValidation.results.valid
              ? continueCheckoutSuccess({ payload: { targetRoute: undefined, basketValidation } })
              : continueCheckoutWithIssues({ payload: { targetRoute: undefined, basketValidation } })
          ),
          mapErrorToActionV8(continueCheckoutFail)
        )
      )
    )
  );
  validateBasketAndContinueCheckout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(continueCheckout),
      mapToPayloadProperty('targetStep'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      whenTruthy(),
      concatMap(([targetStep, basketId]) => {
        let scopes: BasketValidationScopeType[] = [''];
        let targetRoute = '';
        switch (targetStep) {
          case 1: {
            scopes = ['Products', 'Value'];
            targetRoute = '/checkout/address';
            break;
          }
          case 2: {
            scopes = ['InvoiceAddress', 'ShippingAddress', 'Addresses'];
            targetRoute = '/checkout/shipping';
            break;
          }
          case 3: {
            scopes = ['Shipping'];
            targetRoute = '/checkout/payment';
            break;
          }
          case 4: {
            scopes = ['Payment'];
            targetRoute = '/checkout/review';
            break;
          }
          // before order creation the whole basket is validated again
          case 5: {
            scopes = ['All'];
            targetRoute = 'auto'; // targetRoute will be calculated in dependence of the validation result
            break;
          }
        }
        return this.basketService.validateBasket(basketId, scopes).pipe(
          map(basketValidation =>
            basketValidation.results.valid
              ? targetStep === 5 && !basketValidation.results.adjusted
                ? createOrder({ payload: { basketId } })
                : continueCheckoutSuccess({ payload: { targetRoute, basketValidation } })
              : continueCheckoutWithIssues({ payload: { targetRoute, basketValidation } })
          ),
          mapErrorToActionV8(continueCheckoutFail)
        );
      })
    )
  );
  jumpToNextCheckoutStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(continueCheckoutSuccess, continueCheckoutWithIssues),
      mapToPayload(),
      tap(payload => {
        this.jumpToTargetRoute(payload.targetRoute, payload.basketValidation && payload.basketValidation.results);
      }),

      filter(
        payload =>
          payload.basketValidation &&
          payload.basketValidation.results.adjusted &&
          !!payload.basketValidation.results.infos
      ),
      map(payload => payload.basketValidation),
      concatMap(validation => {
        // Load eligible shipping methods if shipping infos are available
        if (validation.scopes.includes('Shipping')) {
          return [loadBasketEligibleShippingMethods()];
          // Load eligible payment methods if payment infos are available
        } else if (validation.scopes.includes('Payment')) {
          return [loadBasketEligiblePaymentMethods()];
        } else {
          // Load products if product related infos are available
          return validation.results.infos
            .filter(info => info.parameters && info.parameters.productSku)
            .map(info => loadProduct({ payload: { sku: info.parameters.productSku } }));
        }
      })
    )
  );

  /**
   * Navigates to the target route, in case targetRoute equals 'auto' the target route will be calculated based on the calculation result
   */
  private jumpToTargetRoute(targetRoute: string, results: BasketValidationResultType) {
    if (!targetRoute || !results) {
      return;
    }
    if (targetRoute === 'auto') {
      // determine where to go if basket validation finished with an issue before order creation
      // consider the 1st error or info - maybe this logic can be enhanced later on
      let scope =
        results.errors && results.errors.find(issue => issue.parameters && issue.parameters.scopes).parameters.scopes;
      if (!scope) {
        scope =
          results.infos && results.infos.find(issue => issue.parameters && issue.parameters.scopes).parameters.scopes;
      }

      switch (scope) {
        case 'Products':
        case 'Value': {
          this.router.navigate(['/basket'], { queryParams: { error: true } });
          break;
        }
        case 'Addresses':
        case 'ShippingAddress':
        case 'InvoiceAddress': {
          this.router.navigate(['/checkout/address'], { queryParams: { error: true } });
          break;
        }
        case 'Shipping': {
          this.router.navigate(['/checkout/shipping'], { queryParams: { error: true } });
          break;
        }
        case 'Payment': {
          this.router.navigate(['/checkout/payment'], { queryParams: { error: true } });
          break;
        }
        // otherwise stay on the current page
      }
    } else if (results.valid && !results.adjusted) {
      this.router.navigate([targetRoute]);
    }
  }
}
