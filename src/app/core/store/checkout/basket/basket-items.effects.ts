import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import {
  concatMap,
  debounceTime,
  defaultIfEmpty,
  filter,
  last,
  map,
  mapTo,
  mergeMap,
  reduce,
  tap,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getProductEntities, loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToActionV8, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';

import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  loadBasket,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketItemsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<{}>,
    private basketService: BasketService
  ) {}

  addProductToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBasket),
      mapToPayload(),
      // accumulate all actions
      window(
        this.actions$.pipe(
          ofType(addProductToBasket),
          debounceTime(1000)
        )
      ),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(this.store.pipe(select(getProductEntities))),
          // accumulate changes
          reduce((acc, [val, entities]) => {
            const element = acc.find(x => x.sku === val.sku);
            if (element) {
              element.quantity += val.quantity;
            } else {
              acc.push({ ...val, unit: entities[val.sku].packingUnit });
            }
            return acc;
          }, []),
          map(items => addItemsToBasket({ payload: { items } }))
        )
      )
    )
  );
  addItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([{ basketId }, currentBasketId]) => !!currentBasketId || !!basketId),
      concatMap(([payload, currentBasketId]) => {
        // get basket id from AddItemsToBasket action if set, otherwise use current basket id
        const basketId = payload.basketId || currentBasketId;

        return this.basketService.addItemsToBasket(basketId, payload.items).pipe(
          map(info => addItemsToBasketSuccess({ payload: { info } })),
          mapErrorToActionV8(addItemsToBasketFail)
        );
      })
    )
  );
  loadProductsForAddItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      concatMap(payload => [...payload.items.map(item => loadProduct({ payload: { sku: item.sku } }))])
    )
  );
  createBasketBeforeAddItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([payload, basketId]) => !basketId && !payload.basketId),
      mergeMap(([{ items }]) =>
        this.basketService.createBasket().pipe(
          mapToProperty('id'),
          map(basketId => addItemsToBasket({ payload: { items, basketId } }))
        )
      )
    )
  );
  updateBasketItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItems),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      filter(([payload, basket]) => !!basket.lineItems && !!payload.lineItemUpdates),
      map(([{ lineItemUpdates }, { lineItems }]) =>
        LineItemUpdateHelper.filterUpdatesByItems(lineItemUpdates, lineItems as LineItemUpdateHelperItem[])
      ),

      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([updates, basketId]) =>
        concat(
          ...updates.map(update => {
            if (update.quantity === 0) {
              return this.basketService.deleteBasketItem(basketId, update.itemId);
            } else {
              return this.basketService.updateBasketItem(basketId, update.itemId, {
                quantity: update.quantity > 0 ? { value: update.quantity, unit: update.unit } : undefined,
                product: update.sku,
              });
            }
          })
        ).pipe(
          defaultIfEmpty(),
          last(),
          map(info => updateBasketItemsSuccess({ payload: { info } })),
          mapErrorToActionV8(updateBasketItemsFail)
        )
      )
    )
  );
  validateBasketAfterUpdateFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItemsFail),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      mapTo(validateBasket({ payload: { scopes: ['Products'] } }))
    )
  );
  deleteBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItem),
      mapToPayloadProperty('itemId'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([itemId, basketId]) =>
        this.basketService.deleteBasketItem(basketId, itemId).pipe(
          map(info => deleteBasketItemSuccess({ payload: { info } })),
          mapErrorToActionV8(deleteBasketItemFail)
        )
      )
    )
  );
  loadBasketAfterBasketItemsChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
      mapToPayloadProperty('info'),
      tap(info =>
        info && info.length && info[0].message
          ? this.router.navigate(['/basket'], { queryParams: { error: true } })
          : undefined
      ),
      mapTo(loadBasket())
    )
  );
}
