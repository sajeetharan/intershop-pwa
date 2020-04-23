import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import { filter, map, mapTo, mergeMap, switchMap, switchMapTo, withLatestFrom } from 'rxjs/operators';

import { SuccessMessage } from 'ish-core/store/messages';
import { UserActionTypes, getUserAuthorized } from 'ish-core/store/user';
import { SetBreadcrumbData } from 'ish-core/store/viewconf';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { OrderTemplate, OrderTemplateHeader } from '../../models/order-templates/order-template.model';
import { OrderTemplateService } from '../../services/order-templates/order-template.service';

import * as orderTemplateActions from './order-template.actions';
import {
  getOrderTemplateDetails,
  getSelectedOrderTemplateDetails,
  getSelectedOrderTemplateId,
} from './order-template.selectors';

@Injectable()
export class OrderTemplateEffects {
  constructor(
    private actions$: Actions,
    private orderTemplateService: OrderTemplateService,
    private store: Store<{}>
  ) {}

  @Effect()
  loadOrderTemplates$ = this.actions$.pipe(
    ofType<orderTemplateActions.LoadOrderTemplates>(orderTemplateActions.OrderTemplatesActionTypes.LoadOrderTemplates),
    withLatestFrom(this.store.pipe(select(getUserAuthorized))),
    filter(([, authorized]) => authorized),
    switchMap(() =>
      this.orderTemplateService.getOrderTemplates().pipe(
        map(orderTemplates => new orderTemplateActions.LoadOrderTemplatesSuccess({ orderTemplates })),
        mapErrorToAction(orderTemplateActions.LoadOrderTemplatesFail)
      )
    )
  );

  @Effect()
  createOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.CreateOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.CreateOrderTemplate
    ),
    mapToPayloadProperty('orderTemplate'),
    mergeMap((orderTemplateData: OrderTemplateHeader) =>
      this.orderTemplateService.createOrderTemplate(orderTemplateData).pipe(
        mergeMap(orderTemplate => [
          new orderTemplateActions.CreateOrderTemplateSuccess({ orderTemplate }),
          new SuccessMessage({
            message: 'account.order_template.new_order_template.confirmation',
            messageParams: { 0: orderTemplate.title },
          }),
        ]),
        mapErrorToAction(orderTemplateActions.CreateOrderTemplateFail)
      )
    )
  );

  @Effect()
  deleteOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.DeleteOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.DeleteOrderTemplate
    ),
    mapToPayloadProperty('orderTemplateId'),
    mergeMap(orderTemplateId => this.store.pipe(select(getOrderTemplateDetails, { id: orderTemplateId }))),
    whenTruthy(),
    map(orderTemplate => ({ orderTemplateId: orderTemplate.id, title: orderTemplate.title })),
    mergeMap(({ orderTemplateId, title }) =>
      this.orderTemplateService.deleteOrderTemplate(orderTemplateId).pipe(
        mergeMap(() => [
          new orderTemplateActions.DeleteOrderTemplateSuccess({ orderTemplateId }),
          new SuccessMessage({
            message: 'account.order_template.delete_order_template.confirmation',
            messageParams: { 0: title },
          }),
        ]),
        mapErrorToAction(orderTemplateActions.DeleteOrderTemplateFail)
      )
    )
  );

  @Effect()
  updateOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.UpdateOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.UpdateOrderTemplate
    ),
    mapToPayloadProperty('orderTemplate'),
    mergeMap((newOrderTemplate: OrderTemplate) =>
      this.orderTemplateService.updateOrderTemplate(newOrderTemplate).pipe(
        mergeMap(orderTemplate => [
          new orderTemplateActions.UpdateOrderTemplateSuccess({ orderTemplate }),
          new SuccessMessage({
            message: 'account.wishlists.edit_wishlist.confirmation',
            messageParams: { 0: orderTemplate.title },
          }),
        ]),
        mapErrorToAction(orderTemplateActions.UpdateOrderTemplateFail)
      )
    )
  );

  /**
   * Reload Order Template after a creation or update to ensure integrity with server concerning the preferred order template
   */
  @Effect()
  reloadOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.UpdateOrderTemplateSuccess | orderTemplateActions.CreateOrderTemplateSuccess>(
      orderTemplateActions.OrderTemplatesActionTypes.UpdateOrderTemplateSuccess,
      orderTemplateActions.OrderTemplatesActionTypes.CreateOrderTemplateSuccess
    ),
    mapToPayloadProperty('orderTemplate'),
    filter(orderTemplate => orderTemplate && orderTemplate.preferred),
    mapTo(new orderTemplateActions.LoadOrderTemplates())
  );

  @Effect()
  addProductToOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.AddProductToOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.AddProductToOrderTemplate
    ),
    mapToPayload(),
    mergeMap(payload =>
      this.orderTemplateService.addProductToOrderTemplate(payload.orderTemplateId, payload.sku, payload.quantity).pipe(
        map(orderTemplate => new orderTemplateActions.AddProductToOrderTemplateSuccess({ orderTemplate })),
        mapErrorToAction(orderTemplateActions.AddProductToOrderTemplateFail)
      )
    )
  );

  @Effect()
  addProductToNewOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.AddProductToNewOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.AddProductToNewOrderTemplate
    ),
    mapToPayload(),
    mergeMap(payload =>
      this.orderTemplateService
        .createOrderTemplate({
          title: payload.title,
          preferred: false,
        })
        .pipe(
          // use created order template data to dispatch addProduct action
          mergeMap(orderTemplate => [
            new orderTemplateActions.CreateOrderTemplateSuccess({ orderTemplate }),
            new orderTemplateActions.AddProductToOrderTemplate({
              orderTemplateId: orderTemplate.id,
              sku: payload.sku,
              quantity: payload.quantity,
            }),
            new orderTemplateActions.SelectOrderTemplate({ id: orderTemplate.id }),
          ]),
          mapErrorToAction(orderTemplateActions.CreateOrderTemplateFail)
        )
    )
  );

  @Effect()
  moveItemToOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.MoveItemToOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.MoveItemToOrderTemplate
    ),
    mapToPayload(),
    mergeMap(payload => {
      if (!payload.target.id) {
        return [
          new orderTemplateActions.AddProductToNewOrderTemplate({
            title: payload.target.title,
            sku: payload.target.sku,
            quantity: payload.target.quantity,
          }),
          new orderTemplateActions.RemoveItemFromOrderTemplate({
            orderTemplateId: payload.source.id,
            sku: payload.target.sku,
          }),
        ];
      } else {
        return [
          new orderTemplateActions.AddProductToOrderTemplate({
            orderTemplateId: payload.target.id,
            sku: payload.target.sku,
            quantity: payload.target.quantity,
          }),
          new orderTemplateActions.RemoveItemFromOrderTemplate({
            orderTemplateId: payload.source.id,
            sku: payload.target.sku,
          }),
        ];
      }
    })
  );

  @Effect()
  removeProductFromOrderTemplate$ = this.actions$.pipe(
    ofType<orderTemplateActions.RemoveItemFromOrderTemplate>(
      orderTemplateActions.OrderTemplatesActionTypes.RemoveItemFromOrderTemplate
    ),
    mapToPayload(),
    mergeMap(payload =>
      this.orderTemplateService.removeProductFromOrderTemplate(payload.orderTemplateId, payload.sku).pipe(
        map(orderTemplate => new orderTemplateActions.RemoveItemFromOrderTemplateSuccess({ orderTemplate })),
        mapErrorToAction(orderTemplateActions.RemoveItemFromOrderTemplateFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectedOrderTemplate$ = this.actions$.pipe(
    ofRoute(),
    mapToParam<string>('orderTemplateName'),
    withLatestFrom(this.store.pipe(select(getSelectedOrderTemplateId))),
    filter(([routerId, storeId]) => routerId !== storeId),
    map(([id]) => new orderTemplateActions.SelectOrderTemplate({ id }))
  );

  /**
   * Trigger LoadOrderTemplates action after LoginUserSuccess.
   */
  @Effect()
  loadOrderTemplatesAfterLogin$ = this.store.pipe(
    select(getUserAuthorized),
    whenTruthy(),
    mapTo(new orderTemplateActions.LoadOrderTemplates())
  );

  /**
   * Trigger ResetORderTemplateState action after LogoutUser.
   */
  @Effect()
  resetOrderTemplateStateAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),

    mapTo(new orderTemplateActions.ResetOrderTemplateState())
  );

  @Effect()
  setOrderTemplateBreadcrumb$ = this.actions$.pipe(
    ofRoute(),
    mapToParam('orderTemplateName'),
    whenTruthy(),
    switchMapTo(this.store.pipe(select(getSelectedOrderTemplateDetails))),
    whenTruthy(),
    map(
      orderTemplate =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'account.ordertemplates.link', link: '/account/wishlists' },
            { text: orderTemplate.title },
          ],
        })
    )
  );
}
