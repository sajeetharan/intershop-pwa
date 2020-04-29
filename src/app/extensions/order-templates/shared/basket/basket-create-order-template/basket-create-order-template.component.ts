import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-templates/order-template.model';
import { SelectOrderTemplateModalComponent } from '../../order-templates/select-order-template-modal/select-order-template-modal.component';

@Component({
  selector: 'ish-basket-create-order-template',
  templateUrl: './basket-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCreateOrderTemplateComponent implements OnInit {
  @Input() products: LineItemView[];
  @Input() class?: string;
  /**
   * Indicator for loading state of order templates
   */
  currentOrderTemplate$: Observable<OrderTemplate>;

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private accountFacade: AccountFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentOrderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
  }

  /**
   * if the user is not logged in display login dialog, else open select wishlist dialog
   */
  openModal(modal: SelectOrderTemplateModalComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'order-templates' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  createOrderTemplate(orderTemplate: OrderTemplate) {
    // Refactor to create reduce in effects to acc multiple requests
    this.orderTemplatesFacade.addOrderTemplate(orderTemplate);
    this.currentOrderTemplate$
      .pipe(
        filter(s => !!s && !!s.id),
        take(1)
      )
      .subscribe(newOrderTemplate => {
        this.products.forEach((product, index) => {
          setTimeout(() => {
            this.orderTemplatesFacade.addProductToOrderTemplate(
              newOrderTemplate.id,
              product.productSKU,
              product.quantity.value
            );
          }, index * 250);
        });
      });
  }
}
