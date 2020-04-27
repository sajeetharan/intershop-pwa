import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';
export const loadWishlists = createAction('[Wishlists Internal] Load Wishlists');
export const loadWishlistsSuccess = createAction(
  '[Wishlists API] Load Wishlists Success',
  props<{ payload: { wishlists: Wishlist[] } }>()
);
export const loadWishlistsFail = createAction(
  '[Wishlists API] Load Wishlists Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createWishlist = createAction(
  '[Wishlists] Create Wishlist',
  props<{ payload: { wishlist: WishlistHeader } }>()
);
export const createWishlistSuccess = createAction(
  '[Wishlists API] Create Wishlist Success',
  props<{ payload: { wishlist: Wishlist } }>()
);
export const createWishlistFail = createAction(
  '[Wishlists API] Create Wishlist Fail',
  props<{ payload: { error: HttpError } }>()
);
export const updateWishlist = createAction('[Wishlists] Update Wishlist', props<{ payload: { wishlist: Wishlist } }>());
export const updateWishlistSuccess = createAction(
  '[Wishlists API] Update Wishlist Success',
  props<{ payload: { wishlist: Wishlist } }>()
);
export const updateWishlistFail = createAction(
  '[Wishlists API] Update Wishlist Fail',
  props<{ payload: { error: HttpError } }>()
);
export const deleteWishlist = createAction('[Wishlists] Delete Wishlist', props<{ payload: { wishlistId: string } }>());
export const deleteWishlistSuccess = createAction(
  '[Wishlists API] Delete Wishlist Success',
  props<{ payload: { wishlistId: string } }>()
);
export const deleteWishlistFail = createAction(
  '[Wishlists API] Delete Wishlist Fail',
  props<{ payload: { error: HttpError } }>()
);
export const addProductToWishlist = createAction(
  '[Wishlists] Add Item to Wishlist',
  props<{ payload: { wishlistId: string; sku: string; quantity?: number } }>()
);
export const addProductToWishlistSuccess = createAction(
  '[Wishlists API] Add Item to Wishlist Success',
  props<{ payload: { wishlist: Wishlist } }>()
);
export const addProductToWishlistFail = createAction(
  '[Wishlists API] Add Item to Wishlist Fail',
  props<{ payload: { error: HttpError } }>()
);
export const addProductToNewWishlist = createAction(
  '[Wishlists Internal] Add Product To New Wishlist',
  props<{ payload: { title: string; sku: string } }>()
);
export const moveItemToWishlist = createAction(
  '[Wishlists] Move Item to another Wishlist',
  props<{ payload: { source: { id: string }; target: { id?: string; title?: string; sku: string } } }>()
);
export const removeItemFromWishlist = createAction(
  '[Wishlists] Remove Item from Wishlist',
  props<{ payload: { wishlistId: string; sku: string } }>()
);
export const removeItemFromWishlistSuccess = createAction(
  '[Wishlists API] Remove Item from Wishlist Success',
  props<{ payload: { wishlist: Wishlist } }>()
);
export const removeItemFromWishlistFail = createAction(
  '[Wishlists API] Remove Item from Wishlist Fail',
  props<{ payload: { error: HttpError } }>()
);
export const selectWishlist = createAction(
  '[Wishlists Internal] Select Wishlist',
  props<{ payload: { id: string } }>()
);
export const resetWishlistState = createAction('[Wishlists Internal] Reset Wishlist State');
