import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { toastMessage } from 'ish-core/store/messages';
import { selectRouteParam } from 'ish-core/store/router';
import { getUserAuthorized, logoutUser } from 'ish-core/store/user';
import { setBreadcrumbData } from 'ish-core/store/viewconf';
import {
  distinctCompareWith,
  mapErrorToActionV8,
  mapToPayload,
  mapToPayloadProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';
import { WishlistService } from '../../services/wishlist/wishlist.service';

import {
  addProductToNewWishlist,
  addProductToWishlist,
  addProductToWishlistFail,
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
  moveItemToWishlist,
  removeItemFromWishlist,
  removeItemFromWishlistFail,
  removeItemFromWishlistSuccess,
  resetWishlistState,
  selectWishlist,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
} from './wishlist.actions';
import { getSelectedWishlistDetails, getSelectedWishlistId, getWishlistDetails } from './wishlist.selectors';

@Injectable()
export class WishlistEffects {
  constructor(private actions$: Actions, private wishlistService: WishlistService, private store: Store<{}>) {}

  loadWishlists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWishlists),
      withLatestFrom(this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      switchMap(() =>
        this.wishlistService.getWishlists().pipe(
          map(wishlists => loadWishlistsSuccess({ payload: { wishlists } })),
          mapErrorToActionV8(loadWishlistsFail)
        )
      )
    )
  );
  createWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createWishlist),
      mapToPayloadProperty('wishlist'),
      mergeMap((wishlistData: WishlistHeader) =>
        this.wishlistService.createWishlist(wishlistData).pipe(
          mergeMap(wishlist => [
            createWishlistSuccess({ payload: { wishlist } }),
            toastMessage({
              payload: {
                message: 'account.wishlists.new_wishlist.confirmation',
                messageType: 'success',
                messageParams: { 0: wishlist.title },
              },
            }),
          ]),
          mapErrorToActionV8(createWishlistFail)
        )
      )
    )
  );
  deleteWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteWishlist),
      mapToPayloadProperty('wishlistId'),
      mergeMap(wishlistId => this.store.pipe(select(getWishlistDetails, { id: wishlistId }))),
      whenTruthy(),
      map(wishlist => ({ wishlistId: wishlist.id, title: wishlist.title })),
      mergeMap(({ wishlistId, title }) =>
        this.wishlistService.deleteWishlist(wishlistId).pipe(
          mergeMap(() => [
            deleteWishlistSuccess({ payload: { wishlistId } }),
            toastMessage({
              payload: {
                message: 'account.wishlists.delete_wishlist.confirmation',
                messageType: 'success',
                messageParams: { 0: title },
              },
            }),
          ]),
          mapErrorToActionV8(deleteWishlistFail)
        )
      )
    )
  );
  updateWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateWishlist),
      mapToPayloadProperty('wishlist'),
      mergeMap((newWishlist: Wishlist) =>
        this.wishlistService.updateWishlist(newWishlist).pipe(
          mergeMap(wishlist => [
            updateWishlistSuccess({ payload: { wishlist } }),
            toastMessage({
              payload: {
                message: 'account.wishlists.edit_wishlist.confirmation',
                messageType: 'success',
                messageParams: { 0: wishlist.title },
              },
            }),
          ]),
          mapErrorToActionV8(updateWishlistFail)
        )
      )
    )
  );
  reloadWishlists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateWishlistSuccess, createWishlistSuccess),
      mapToPayloadProperty('wishlist'),
      filter(wishlist => wishlist && wishlist.preferred),
      mapTo(loadWishlists())
    )
  );
  addProductToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToWishlist),
      mapToPayload(),
      mergeMap(payload =>
        this.wishlistService.addProductToWishlist(payload.wishlistId, payload.sku, payload.quantity).pipe(
          map(wishlist => addProductToWishlistSuccess({ payload: { wishlist } })),
          mapErrorToActionV8(addProductToWishlistFail)
        )
      )
    )
  );
  addProductToNewWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToNewWishlist),
      mapToPayload(),
      mergeMap(payload =>
        this.wishlistService
          .createWishlist({
            title: payload.title,
            preferred: false,
          })
          .pipe(
            // use created wishlist data to dispatch addProduct action
            mergeMap(wishlist => [
              createWishlistSuccess({ payload: { wishlist } }),
              addProductToWishlist({ payload: { wishlistId: wishlist.id, sku: payload.sku } }),
              selectWishlist({ payload: { id: wishlist.id } }),
            ]),
            mapErrorToActionV8(createWishlistFail)
          )
      )
    )
  );
  moveItemToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveItemToWishlist),
      mapToPayload(),
      mergeMap(payload => {
        if (!payload.target.id) {
          return [
            addProductToNewWishlist({ payload: { title: payload.target.title, sku: payload.target.sku } }),
            removeItemFromWishlist({ payload: { wishlistId: payload.source.id, sku: payload.target.sku } }),
          ];
        } else {
          return [
            addProductToWishlist({ payload: { wishlistId: payload.target.id, sku: payload.target.sku } }),
            removeItemFromWishlist({ payload: { wishlistId: payload.source.id, sku: payload.target.sku } }),
          ];
        }
      })
    )
  );
  removeProductFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeItemFromWishlist),
      mapToPayload(),
      mergeMap(payload =>
        this.wishlistService.removeProductFromWishlist(payload.wishlistId, payload.sku).pipe(
          map(wishlist => removeItemFromWishlistSuccess({ payload: { wishlist } })),
          mapErrorToActionV8(removeItemFromWishlistFail)
        )
      )
    )
  );
  routeListenerForSelectedWishlist$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('wishlistName')),
      distinctCompareWith(this.store.pipe(select(getSelectedWishlistId))),
      map(id => selectWishlist({ payload: { id } }))
    )
  );
  loadWishlistsAfterLogin$ = createEffect(() =>
    this.store.pipe(
      select(getUserAuthorized),
      whenTruthy(),
      mapTo(loadWishlists())
    )
  );
  resetWishlistStateAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),

      mapTo(resetWishlistState())
    )
  );
  setWishlistBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedWishlistDetails),
      whenTruthy(),
      map(wishlist =>
        setBreadcrumbData({
          payload: {
            breadcrumbData: [
              { key: 'account.wishlists.breadcrumb_link', link: '/account/wishlists' },
              { text: wishlist.title },
            ],
          },
        })
      )
    )
  );
}
