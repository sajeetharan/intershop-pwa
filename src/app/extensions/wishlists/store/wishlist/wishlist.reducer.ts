import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Wishlist } from '../../models/wishlist/wishlist.model';

import {
  addProductToWishlistSuccess,
  createWishlist,
  createWishlistFail,
  createWishlistSuccess,
  deleteWishlist,
  deleteWishlistFail,
  deleteWishlistSuccess,
  loadWishlists,
  loadWishlistsFail,
  loadWishlistsSuccess,
  removeItemFromWishlistSuccess,
  resetWishlistState,
  selectWishlist,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
} from './wishlist.actions';

export interface WishlistState extends EntityState<Wishlist> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const wishlistsAdapter = createEntityAdapter<Wishlist>({
  selectId: wishlist => wishlist.id,
});

export const initialState = wishlistsAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export function wishlistReducer(state = initialState, action: Action): WishlistState {
  return reducer(state, action);
}

const reducer = createReducer(
  initialState,
  on(updateWishlist, loadWishlists, createWishlist, deleteWishlist, state => ({
    ...state,
    loading: true,
  })),
  on(updateWishlistFail, loadWishlistsFail, deleteWishlistFail, createWishlistFail, (state, action) => {
    const { error } = action.payload;
    return {
      ...state,
      loading: false,
      error,
      selected: undefined,
    };
  }),
  on(loadWishlistsSuccess, (state, action) => {
    const { wishlists } = action.payload;
    return wishlistsAdapter.setAll(wishlists, {
      ...state,
      loading: false,
    });
  }),
  on(
    createWishlistSuccess,
    updateWishlistSuccess,
    addProductToWishlistSuccess,
    removeItemFromWishlistSuccess,
    (state, action) => {
      const { wishlist } = action.payload;

      return wishlistsAdapter.upsertOne(wishlist, {
        ...state,
        loading: false,
      });
    }
  ),
  on(deleteWishlistSuccess, (state, action) => {
    const { wishlistId } = action.payload;
    return wishlistsAdapter.removeOne(wishlistId, {
      ...state,
      loading: false,
    });
  }),
  on(selectWishlist, (state, action) => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  }),
  on(resetWishlistState, () => initialState)
);
