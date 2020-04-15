import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-templates/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail',
  templateUrl: './account-order-template-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailComponent implements OnInit, OnDestroy {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  editPreferences(orderTemplate: OrderTemplate, orderTemplateName: string) {
    this.orderTemplatesFacade.updateOrderTemplate({
      ...orderTemplate,
      id: orderTemplateName,
    });
  }
}
