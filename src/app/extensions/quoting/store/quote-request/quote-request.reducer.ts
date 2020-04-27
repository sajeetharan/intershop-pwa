import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { logoutUser } from 'ish-core/store/user';

import { QuoteRequestItem } from '../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../models/quote-request/quote-request.interface';

import {
  addBasketToQuoteRequest,
  addBasketToQuoteRequestFail,
  addBasketToQuoteRequestSuccess,
  addProductToQuoteRequest,
  addProductToQuoteRequestFail,
  addProductToQuoteRequestSuccess,
  addQuoteRequest,
  addQuoteRequestFail,
  addQuoteRequestSuccess,
  createQuoteRequestFromQuoteRequest,
  createQuoteRequestFromQuoteRequestFail,
  createQuoteRequestFromQuoteRequestSuccess,
  deleteItemFromQuoteRequest,
  deleteItemFromQuoteRequestFail,
  deleteItemFromQuoteRequestSuccess,
  deleteQuoteRequest,
  deleteQuoteRequestFail,
  deleteQuoteRequestSuccess,
  loadQuoteRequestItems,
  loadQuoteRequestItemsFail,
  loadQuoteRequestItemsSuccess,
  loadQuoteRequests,
  loadQuoteRequestsFail,
  loadQuoteRequestsSuccess,
  selectQuoteRequest,
  submitQuoteRequest,
  submitQuoteRequestFail,
  submitQuoteRequestSuccess,
  updateQuoteRequest,
  updateQuoteRequestFail,
  updateQuoteRequestItems,
  updateQuoteRequestItemsFail,
  updateQuoteRequestItemsSuccess,
  updateQuoteRequestSuccess,
  updateSubmitQuoteRequest,
} from './quote-request.actions';

export const quoteRequestAdapter = createEntityAdapter<QuoteRequestData>();

export interface QuoteRequestState extends EntityState<QuoteRequestData> {
  quoteRequestItems: QuoteRequestItem[];
  loading: boolean;
  error: HttpError;
  selected: string;
}

export const initialState: QuoteRequestState = quoteRequestAdapter.getInitialState({
  quoteRequestItems: [],
  loading: false,
  error: undefined,
  selected: undefined,
});

export function quoteRequestReducer(state = initialState, action: Action): QuoteRequestState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(logoutUser, () => initialState),
  on(selectQuoteRequest, (state, action) => ({
    ...state,
    selected: action.payload.id,
  })),
  on(
    loadQuoteRequests,
    addQuoteRequest,
    updateQuoteRequest,
    deleteQuoteRequest,
    submitQuoteRequest,
    updateSubmitQuoteRequest,
    createQuoteRequestFromQuoteRequest,
    loadQuoteRequestItems,
    addProductToQuoteRequest,
    addBasketToQuoteRequest,
    state => ({
      ...state,
      loading: true,
    })
  ),
  on(deleteItemFromQuoteRequest, updateQuoteRequestItems, state => ({
    ...state,
    loading: true,
  })),
  on(
    loadQuoteRequestsFail,
    addQuoteRequestFail,
    updateQuoteRequestFail,
    deleteQuoteRequestFail,
    submitQuoteRequestFail,
    createQuoteRequestFromQuoteRequestFail,
    loadQuoteRequestItemsFail,
    addProductToQuoteRequestFail,
    addBasketToQuoteRequestFail,
    updateQuoteRequestItemsFail,
    (state, action) => {
      const error = action.payload.error;

      return {
        ...state,
        error,
        loading: false,
      };
    }
  ),
  on(deleteItemFromQuoteRequestFail, (state, action) => {
    const error = action.payload.error;

    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(loadQuoteRequestsSuccess, (state, action) => {
    const quoteRequests = action.payload.quoteRequests;

    if (!state) {
      return;
    }

    return {
      ...quoteRequestAdapter.setAll(quoteRequests, state),
      loading: false,
    };
  }),
  on(loadQuoteRequestItemsSuccess, (state, action) => {
    const quoteRequestItems = action.payload.quoteRequestItems;

    return {
      ...state,
      quoteRequestItems,
      loading: false,
    };
  }),
  on(
    deleteItemFromQuoteRequestSuccess,
    addQuoteRequestSuccess,
    updateQuoteRequestSuccess,
    deleteQuoteRequestSuccess,
    submitQuoteRequestSuccess,
    createQuoteRequestFromQuoteRequestSuccess,
    addProductToQuoteRequestSuccess,
    addBasketToQuoteRequestSuccess,
    updateQuoteRequestItemsSuccess,
    state => ({
      ...state,
      loading: false,
      error: undefined,
    })
  )
);
