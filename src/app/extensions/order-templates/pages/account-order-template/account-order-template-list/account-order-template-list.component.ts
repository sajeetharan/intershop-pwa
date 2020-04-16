import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplate } from '../../../models/order-templates/order-template.model';

import { ShoppingFacade } from './../../../../../core/facades/shopping.facade';

@Component({
  selector: 'ish-account-order-template-list',
  templateUrl: './account-order-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent implements OnChanges {
  /**
   * The list of order templates of the customer.
   */
  @Input() orderTemplates: OrderTemplate[];
  /**
   * Emits the id of the order template, which is to be deleted.
   */
  @Output() deleteOrderTemplate = new EventEmitter<string>();

  /** The header text of the delete modal. */
  deleteHeader: string;
  preferredOrderTemplate: OrderTemplate;

  constructor(private translate: TranslateService, private productFacade: ShoppingFacade) {}

  ngOnChanges() {
    // determine preferred order template
    this.preferredOrderTemplate =
      this.orderTemplates && this.orderTemplates.length
        ? this.orderTemplates.find(orderTemplates => orderTemplates.preferred)
        : undefined;
  }

  addTemplateToCart() {}

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.deleteOrderTemplate.emit(orderTemplateId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent) {
    this.translate
      .get('modal.heading.remove.order.template', { 0: orderTemplate.title })
      .pipe(take(1))
      .subscribe(res => (modal.options.titleText = res));

    modal.show(orderTemplate.id);
  }
}
