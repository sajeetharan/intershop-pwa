import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, mergeMapTo, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { ofUrl, selectQueryParam } from 'ish-core/store/router';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { getLastAPITokenBeforeLogin, loginUserSuccess, logoutUser } from 'ish-core/store/user';
import { mapErrorToActionV8, mapToPayloadProperty, whenFalsy } from 'ish-core/utils/operators';

import {
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  mergeBasket,
  mergeBasketFail,
  mergeBasketSuccess,
  resetBasket,
  resetBasketErrors,
  updateBasket,
  updateBasketFail,
  updateBasketShippingMethod,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private basketService: BasketService) {}

  loadBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasket),
      mergeMap(() =>
        this.basketService.getBasket().pipe(
          map(basket => loadBasketSuccess({ payload: { basket } })),
          mapErrorToActionV8(loadBasketFail)
        )
      )
    )
  );
  loadBasketByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketByAPIToken),
      mapToPayloadProperty('apiToken'),
      concatMap(apiToken =>
        this.basketService.getBasketByToken(apiToken).pipe(map(basket => loadBasketSuccess({ payload: { basket } })))
      )
    )
  );
  loadProductsForBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketSuccess, mergeBasketSuccess),
      mapToPayloadProperty('basket'),
      switchMap(basket => [
        ...basket.lineItems.map(({ productSKU }) =>
          loadProductIfNotLoaded({ payload: { sku: productSKU, level: ProductCompletenessLevel.List } })
        ),
      ])
    )
  );
  loadBasketEligibleShippingMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligibleShippingMethods),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([, basket]) =>
        this.basketService.getBasketEligibleShippingMethods(basket.id, basket.bucketId).pipe(
          map(result => loadBasketEligibleShippingMethodsSuccess({ payload: { shippingMethods: result } })),
          mapErrorToActionV8(loadBasketEligibleShippingMethodsFail)
        )
      )
    )
  );
  updateBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasket),
      mapToPayloadProperty('update'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([update, currentBasketId]) =>
        this.basketService.updateBasket(currentBasketId, update).pipe(
          concatMap(basket => [loadBasketSuccess({ payload: { basket } }), resetBasketErrors()]),
          mapErrorToActionV8(updateBasketFail)
        )
      )
    )
  );
  updateBasketShippingMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketShippingMethod),
      mapToPayloadProperty('shippingId'),
      map(commonShippingMethod => updateBasket({ payload: { update: { commonShippingMethod } } }))
    )
  );
  mergeBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      mergeMapTo(
        this.store.pipe(
          select(getCurrentBasket),
          take(1)
        )
      ),
      filter(currentBasket => currentBasket && currentBasket.lineItems && currentBasket.lineItems.length > 0),
      mapTo(mergeBasket())
    )
  );
  mergeBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(mergeBasket),
      mergeMapTo(
        this.store.pipe(
          select(getCurrentBasket),
          take(1)
        )
      ),
      withLatestFrom(this.store.pipe(select(getLastAPITokenBeforeLogin))),
      concatMap(([sourceBasket, authToken]) =>
        this.basketService.mergeBasket(sourceBasket.id, authToken).pipe(
          map(basket => mergeBasketSuccess({ payload: { basket } })),
          mapErrorToActionV8(mergeBasketFail)
        )
      )
    )
  );
  loadBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      switchMap(() => this.basketService.getBaskets()) /* prevent 404 error by checking on existing basket */,
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      filter(
        ([newBaskets, currentBasket]) =>
          (!currentBasket || !currentBasket.lineItems || currentBasket.lineItems.length === 0) && newBaskets.length > 0
      ),
      mapTo(loadBasket())
    )
  );
  resetBasketAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),

      mapTo(resetBasket())
    )
  );
  routeListenerForResettingBasketErrors$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(basket|checkout.*)/),
      select(selectQueryParam('error')),
      whenFalsy(),
      mapTo(resetBasketErrors())
    )
  );
}
