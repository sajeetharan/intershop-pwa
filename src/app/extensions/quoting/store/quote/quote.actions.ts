import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Link } from 'ish-core/models/link/link.model';

import { QuoteLineItemResult } from '../../models/quote-line-item-result/quote-line-item-result.model';
import { QuoteData } from '../../models/quote/quote.interface';
export const selectQuote = createAction('[Quote] Select Quote', props<{ payload: { id: string } }>());
export const loadQuotes = createAction('[Quote Internal] Load Quotes');
export const loadQuotesFail = createAction('[Quote API] Load Quotes Fail', props<{ payload: { error: HttpError } }>());
export const loadQuotesSuccess = createAction(
  '[Quote API] Load Quotes Success',
  props<{ payload: { quotes: QuoteData[] } }>()
);
export const deleteQuote = createAction('[Quote] Delete Quote', props<{ payload: { id: string } }>());
export const deleteQuoteFail = createAction(
  '[Quote API] Delete Quote Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteQuoteSuccess = createAction(
  '[Quote API] Delete Quote Success',
  props<{ payload: { id: string } }>()
);
export const rejectQuote = createAction('[Quote] Reject Quote');
export const rejectQuoteFail = createAction(
  '[Quote API] Reject Quote Fail',
  props<{ payload: { error: HttpError } }>()
);
export const rejectQuoteSuccess = createAction(
  '[Quote API] Reject Quote Success',
  props<{ payload: { id: string } }>()
);
export const createQuoteRequestFromQuote = createAction('[Quote] Create Quote Request from Quote');
export const createQuoteRequestFromQuoteFail = createAction(
  '[Quote API] Create Quote Request from Quote Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createQuoteRequestFromQuoteSuccess = createAction(
  '[Quote API] Create Quote Request from Quote Success',
  props<{ payload: { quoteLineItemRequest: QuoteLineItemResult } }>()
);
export const addQuoteToBasket = createAction(
  '[Basket] Add Quote To Basket',
  props<{ payload: { quoteId: string; basketId?: string } }>()
);
export const addQuoteToBasketFail = createAction(
  '[Basket API] Add Quote To Basket Fail',
  props<{ payload: { error: HttpError } }>()
);
export const addQuoteToBasketSuccess = createAction(
  '[Basket API] Add Quote To Basket Success',
  props<{ payload: { link: Link } }>()
);
export const resetQuoteError = createAction('[Quote] Reset Quote Error');
