import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';

import { SelectOrderTemplateModalComponent } from '../../order-templates/select-order-template-modal/select-order-template-modal.component';

@Component({
  selector: 'ish-basket-create-order-template',
  templateUrl: './basket-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCreateOrderTemplateComponent {
  @Input() products: LineItemView[];
  @Input() class?: string;

  constructor(
    // private orderTemplatesFacade: OrderTemplatesFacade,
    private accountFacade: AccountFacade,
    private router: Router
  ) {}

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

  createOrderTemplate(orderTemplate: { id: string; title: string }) {
    if (!orderTemplate.id) {
      // this.products.forEach(product => {
      //   this.orderTemplatesFacade.addProductToNewOrderTemplate(
      //     orderTemplate.title,
      //     product.productSKU,
      //     product.quantity.value
      //   );
      // });
    } else {
      // this.products.forEach(product => {
      //   this.orderTemplatesFacade.addProductToNewOrderTemplate(
      //     orderTemplate.title,
      //     product.productSKU,
      //     product.quantity.value
      //   );
      // });
    }
  }
}
