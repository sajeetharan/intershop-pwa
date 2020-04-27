import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, mapTo, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { mapErrorToActionV8, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  loadBasket,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
} from './basket.actions';
import { getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketPromotionCodeEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private basketService: BasketService) {}

  addPromotionCodeToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPromotionCodeToBasket),
      mapToPayloadProperty('code'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([code, basketId]) =>
        this.basketService.addPromotionCodeToBasket(basketId, code).pipe(
          mapTo(addPromotionCodeToBasketSuccess()),
          mapErrorToActionV8(addPromotionCodeToBasketFail)
        )
      )
    )
  );
  loadBasketAfterAddPromotionCodeToBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPromotionCodeToBasketSuccess),
      mapTo(loadBasket())
    )
  );
  removePromotionCodeFromBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePromotionCodeFromBasket),
      mapToPayloadProperty('code'),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([code, basketId]) =>
        this.basketService.removePromotionCodeFromBasket(basketId, code).pipe(
          mapTo(removePromotionCodeFromBasketSuccess()),
          mapErrorToActionV8(removePromotionCodeFromBasketFail)
        )
      )
    )
  );
  loadBasketAfterRemovePromotionCodeFromBasketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePromotionCodeFromBasketSuccess),
      mapTo(loadBasket())
    )
  );
}
