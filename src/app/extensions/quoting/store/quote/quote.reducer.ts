import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuoteData } from '../../models/quote/quote.interface';

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
  resetQuoteError,
  selectQuote,
} from './quote.actions';

export const quoteAdapter = createEntityAdapter<QuoteData>();

export interface QuoteState extends EntityState<QuoteData> {
  loading: boolean;
  error: HttpError;
  selected: string;
}

export const initialState: QuoteState = quoteAdapter.getInitialState({
  loading: false,
  error: undefined,
  selected: undefined,
});

export function quoteReducer(state = initialState, action: Action): QuoteState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(selectQuote, (state, action) => ({
    ...state,
    selected: action.payload.id,
  })),
  on(addQuoteToBasket, loadQuotes, deleteQuote, rejectQuote, createQuoteRequestFromQuote, state => ({
    ...state,
    loading: true,
  })),
  on(
    addQuoteToBasketFail,
    loadQuotesFail,
    deleteQuoteFail,
    rejectQuoteFail,
    createQuoteRequestFromQuoteFail,
    (state, action) => {
      const error = action.payload.error;

      return {
        ...state,
        error,
        loading: false,
      };
    }
  ),
  on(loadQuotesSuccess, (state, action) => {
    const quotes = action.payload.quotes;
    if (!state) {
      return;
    }

    return {
      ...quoteAdapter.setAll(quotes, state),
      loading: false,
    };
  }),
  on(addQuoteToBasketSuccess, deleteQuoteSuccess, rejectQuoteSuccess, createQuoteRequestFromQuoteSuccess, state => ({
    ...state,
    loading: false,
  })),
  on(resetQuoteError, state => ({
    ...state,
    error: undefined,
  }))
);
