import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplate, OrderTemplateHeader } from '../models/order-templates/order-template.model';
import {
  AddProductToNewOrderTemplate,
  AddProductToOrderTemplate,
  CreateOrderTemplate,
  DeleteOrderTemplate,
  MoveItemToOrderTemplate,
  RemoveItemFromOrderTemplate,
  UpdateOrderTemplate,
  getAllOrderTemplates,
  getOrderTemplateError,
  getOrderTemplateLoading,
  getPreferredOrderTemplate,
  getSelectedOrderTemplateDetails,
} from '../store/order-templates';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrderTemplatesFacade {
  constructor(private store: Store<{}>) {}

  orderTemplates$: Observable<OrderTemplate[]> = this.store.pipe(select(getAllOrderTemplates));
  currentOrderTemplate$: Observable<OrderTemplate> = this.store.pipe(select(getSelectedOrderTemplateDetails));
  preferredOrderTemplate$: Observable<OrderTemplate> = this.store.pipe(select(getPreferredOrderTemplate));
  orderTemplateLoading$: Observable<boolean> = this.store.pipe(select(getOrderTemplateLoading));
  orderTemplateError$: Observable<HttpError> = this.store.pipe(select(getOrderTemplateError));

  addOrderTemplate(orderTemplate: OrderTemplateHeader): void | HttpError {
    this.store.dispatch(new CreateOrderTemplate({ orderTemplate }));
  }

  deleteOrderTemplate(id: string): void {
    this.store.dispatch(new DeleteOrderTemplate({ orderTemplateId: id }));
  }

  updateOrderTemplate(orderTemplate: OrderTemplate): void {
    this.store.dispatch(new UpdateOrderTemplate({ orderTemplate }));
  }

  addProductToNewOrderTemplate(title: string, sku: string): void {
    this.store.dispatch(new AddProductToNewOrderTemplate({ title, sku }));
  }

  addProductToOrderTemplate(orderTemplateId: string, sku: string, quantity?: number): void {
    this.store.dispatch(new AddProductToOrderTemplate({ orderTemplateId, sku, quantity }));
  }

  moveItemToOrderTemplate(sourceorderTemplateId: string, targetorderTemplateId: string, sku: string): void {
    this.store.dispatch(
      new MoveItemToOrderTemplate({ source: { id: sourceorderTemplateId }, target: { id: targetorderTemplateId, sku } })
    );
  }

  moveItemToNewOrderTemplate(sourceOrderTemplateId: string, title: string, sku: string): void {
    this.store.dispatch(new MoveItemToOrderTemplate({ source: { id: sourceOrderTemplateId }, target: { title, sku } }));
  }

  removeProductFromOrderTemplate(orderTemplateId: string, sku: string): void {
    this.store.dispatch(new RemoveItemFromOrderTemplate({ orderTemplateId, sku }));
  }
}
