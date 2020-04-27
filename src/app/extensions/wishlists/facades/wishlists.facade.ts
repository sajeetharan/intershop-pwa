import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Wishlist, WishlistHeader } from '../models/wishlist/wishlist.model';
import {
  addProductToNewWishlist,
  addProductToWishlist,
  createWishlist,
  deleteWishlist,
  getAllWishlists,
  getPreferredWishlist,
  getSelectedWishlistDetails,
  getWishlistsError,
  getWishlistsLoading,
  moveItemToWishlist,
  removeItemFromWishlist,
  updateWishlist,
} from '../store/wishlist';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class WishlistsFacade {
  constructor(private store: Store<{}>) {}

  wishlists$: Observable<Wishlist[]> = this.store.pipe(select(getAllWishlists));
  currentWishlist$: Observable<Wishlist> = this.store.pipe(select(getSelectedWishlistDetails));
  preferredWishlist$: Observable<Wishlist> = this.store.pipe(select(getPreferredWishlist));
  wishlistLoading$: Observable<boolean> = this.store.pipe(select(getWishlistsLoading));
  wishlistError$: Observable<HttpError> = this.store.pipe(select(getWishlistsError));

  addWishlist(wishlist: WishlistHeader): void | HttpError {
    this.store.dispatch(createWishlist({ payload: { wishlist } }));
  }

  deleteWishlist(id: string): void {
    this.store.dispatch(deleteWishlist({ payload: { wishlistId: id } }));
  }

  updateWishlist(wishlist: Wishlist): void {
    this.store.dispatch(updateWishlist({ payload: { wishlist } }));
  }

  addProductToNewWishlist(title: string, sku: string): void {
    this.store.dispatch(addProductToNewWishlist({ payload: { title, sku } }));
  }

  addProductToWishlist(wishlistId: string, sku: string, quantity?: number): void {
    this.store.dispatch(addProductToWishlist({ payload: { wishlistId, sku, quantity } }));
  }

  moveItemToWishlist(sourceWishlistId: string, targetWishlistId: string, sku: string): void {
    this.store.dispatch(
      moveItemToWishlist({ payload: { source: { id: sourceWishlistId }, target: { id: targetWishlistId, sku } } })
    );
  }

  moveItemToNewWishlist(sourceWishlistId: string, title: string, sku: string): void {
    this.store.dispatch(moveItemToWishlist({ payload: { source: { id: sourceWishlistId }, target: { title, sku } } }));
  }

  removeProductFromWishlist(wishlistId: string, sku: string): void {
    this.store.dispatch(removeItemFromWishlist({ payload: { wishlistId, sku } }));
  }
}
