import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplate, OrderTemplateHeader } from '../models/order-templates/order-template.model';
import {
  AddProductToNewOrderTemplate,
  AddProductToOrderTemplate,
  CreateOrderTemplate,
  CreateOrderTemplateWithItems,
  DeleteOrderTemplate,
  MoveItemToOrderTemplate,
  RemoveItemFromOrderTemplate,
  UpdateOrderTemplate,
  getAllOrderTemplates,
  getOrderTemplateError,
  getOrderTemplateLoading,
  getSelectedOrderTemplateDetails,
} from '../store/order-templates';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrderTemplatesFacade {
  constructor(private store: Store<{}>) {}

  orderTemplates$: Observable<OrderTemplate[]> = this.store.pipe(select(getAllOrderTemplates));
  currentOrderTemplate$: Observable<OrderTemplate> = this.store.pipe(select(getSelectedOrderTemplateDetails));
  orderTemplateLoading$: Observable<boolean> = this.store.pipe(select(getOrderTemplateLoading));
  orderTemplateError$: Observable<HttpError> = this.store.pipe(select(getOrderTemplateError));

  addOrderTemplate(orderTemplate: OrderTemplateHeader): void | HttpError {
    this.store.dispatch(new CreateOrderTemplate({ orderTemplate }));
  }

  addOrderTemplateWithItems(
    orderTemplate: OrderTemplateHeader,
    items: { sku: string; quantity: number }[]
  ): void | HttpError {
    this.store.dispatch(new CreateOrderTemplateWithItems({ orderTemplate, items }));
  }

  deleteOrderTemplate(id: string): void {
    this.store.dispatch(new DeleteOrderTemplate({ orderTemplateId: id }));
  }

  updateOrderTemplate(orderTemplate: OrderTemplate): void {
    this.store.dispatch(new UpdateOrderTemplate({ orderTemplate }));
  }

  addProductToNewOrderTemplate(title: string, sku: string, quantity?: number): void {
    this.store.dispatch(new AddProductToNewOrderTemplate({ title, sku, quantity }));
  }

  addProductToOrderTemplate(orderTemplateId: string, sku: string, quantity?: number): void {
    this.store.dispatch(new AddProductToOrderTemplate({ orderTemplateId, sku, quantity }));
  }

  moveItemToOrderTemplate(
    sourceorderTemplateId: string,
    targetorderTemplateId: string,
    sku: string,
    quantity: number
  ): void {
    this.store.dispatch(
      new MoveItemToOrderTemplate({
        source: { id: sourceorderTemplateId },
        target: { id: targetorderTemplateId, sku, quantity },
      })
    );
  }

  moveItemToNewOrderTemplate(sourceOrderTemplateId: string, title: string, sku: string, quantity: number): void {
    this.store.dispatch(
      new MoveItemToOrderTemplate({ source: { id: sourceOrderTemplateId }, target: { title, sku, quantity } })
    );
  }

  removeProductFromOrderTemplate(orderTemplateId: string, sku: string): void {
    this.store.dispatch(new RemoveItemFromOrderTemplate({ orderTemplateId, sku }));
  }
}
