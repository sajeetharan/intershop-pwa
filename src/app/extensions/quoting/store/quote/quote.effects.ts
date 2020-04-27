import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getCurrentBasketId, updateBasket } from 'ish-core/store/checkout/basket';
import { selectRouteParam } from 'ish-core/store/router';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { loadCompanyUserSuccess } from 'ish-core/store/user';
import { setBreadcrumbData } from 'ish-core/store/viewconf';
import { mapErrorToActionV8, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { QuoteService } from '../../services/quote/quote.service';
import { submitQuoteRequestSuccess } from '../quote-request';

import {
  addQuoteToBasket,
  addQuoteToBasketFail,
  addQuoteToBasketSuccess,
  createQuoteRequestFromQuote,
  createQuoteRequestFromQuoteFail,
  createQuoteRequestFromQuoteSuccess,
  deleteQuote,
  deleteQuoteFail,
  deleteQuoteSuccess,
  loadQuotes,
  loadQuotesFail,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuoteFail,
  rejectQuoteSuccess,
  selectQuote,
} from './quote.actions';
import { getSelectedQuote, getSelectedQuoteId, getSelectedQuoteWithProducts } from './quote.selectors';

@Injectable()
export class QuoteEffects {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private quoteService: QuoteService,
    private basketService: BasketService,
    private router: Router,
    private store: Store<{}>,
    private translateService: TranslateService
  ) {}

  loadQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotes),
      concatMap(() =>
        this.quoteService.getQuotes().pipe(
          map(quotes => loadQuotesSuccess({ payload: { quotes } })),
          mapErrorToActionV8(loadQuotesFail)
        )
      )
    )
  );
  deleteQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuote),
      mapToPayloadProperty('id'),
      concatMap(quoteId =>
        this.quoteService.deleteQuote(quoteId).pipe(
          map(id => deleteQuoteSuccess({ payload: { id } })),
          mapErrorToActionV8(deleteQuoteFail)
        )
      )
    )
  );
  rejectQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteId))),
      concatMap(([, quoteId]) =>
        this.quoteService.rejectQuote(quoteId).pipe(
          map(id => rejectQuoteSuccess({ payload: { id } })),
          mapErrorToActionV8(rejectQuoteFail)
        )
      )
    )
  );
  createQuoteRequestFromQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createQuoteRequestFromQuote),
      withLatestFrom(this.store.pipe(select(getSelectedQuoteWithProducts))),
      concatMap(([, currentQuoteRequest]) =>
        this.quoteService.createQuoteRequestFromQuote(currentQuoteRequest).pipe(
          map(quoteLineItemRequest => createQuoteRequestFromQuoteSuccess({ payload: { quoteLineItemRequest } })),
          tap(quoteLineItemResult =>
            this.router.navigate([`/account/quotes/request/${quoteLineItemResult.payload.quoteLineItemRequest.title}`])
          ),
          mapErrorToActionV8(createQuoteRequestFromQuoteFail)
        )
      )
    )
  );
  loadQuotesAfterChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteQuoteSuccess, rejectQuoteSuccess, submitQuoteRequestSuccess, loadCompanyUserSuccess),
      filter(() => this.featureToggleService.enabled('quoting')),
      mapTo(loadQuotes())
    )
  );
  routeListenerForSelectingQuote$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('quoteId')),
      map(id => selectQuote({ payload: { id } }))
    )
  );
  loadProductsForSelectedQuote$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(
        ofType(selectQuote),
        mapToPayloadProperty('id')
      ),
      this.actions$.pipe(
        ofType(loadQuotesSuccess),
        mapToPayloadProperty('quotes')
      ),
    ]).pipe(
      map(([quoteId, quotes]) => quotes.filter(quote => quote.id === quoteId).pop()),
      whenTruthy(),
      concatMap(quote => [
        ...quote.items.map(({ productSKU }) =>
          loadProductIfNotLoaded({ payload: { sku: productSKU, level: ProductCompletenessLevel.List } })
        ),
      ])
    )
  );
  addQuoteToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([payload, currentBasketId]) => !!currentBasketId || !!payload.basketId),
      concatMap(([payload, currentBasketId]) =>
        this.quoteService.addQuoteToBasket(payload.quoteId, currentBasketId || payload.basketId).pipe(
          map(link => addQuoteToBasketSuccess({ payload: { link } })),
          mapErrorToActionV8(addQuoteToBasketFail)
        )
      )
    )
  );
  getBasketBeforeAddQuoteToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      filter(([payload, basketId]) => !basketId && !payload.basketId),
      mergeMap(([{ quoteId }]) =>
        this.basketService
          .createBasket()
          .pipe(map(basket => addQuoteToBasket({ payload: { quoteId, basketId: basket.id } })))
      )
    )
  );
  calculateBasketAfterAddToQuote = createEffect(() =>
    this.actions$.pipe(
      ofType(addQuoteToBasketSuccess, addQuoteToBasketFail),
      mapTo(updateBasket({ payload: { update: { calculated: true } } }))
    )
  );
  gotoBasketAfterAddQuoteToBasketSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addQuoteToBasketSuccess),
        tap(() => {
          this.router.navigate(['/basket']);
        })
      ),
    { dispatch: false }
  );
  setQuoteRequestBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedQuote),
      whenTruthy(),
      withLatestFrom(this.translateService.get('quote.edit.responded.quote_details.text')),
      withLatestFrom(this.translateService.get('quote.edit.unsubmitted.quote_request_details.text')),
      map(([[quote, x], y]) => [quote, quote.state === 'Responded' ? x : y]),
      map(([quote, x]) =>
        setBreadcrumbData({
          payload: {
            breadcrumbData: [
              { key: 'quote.quotes.link', link: '/account/quotes' },
              { text: `${x} - ${quote.displayName}` },
            ],
          },
        })
      )
    )
  );
}
