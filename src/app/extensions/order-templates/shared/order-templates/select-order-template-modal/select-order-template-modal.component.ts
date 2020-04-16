import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderTemplatesFacade } from './../../../facades/order-templates.facade';
import { OrderTemplate } from './../../../models/order-templates/order-template.model';

@Component({
  selector: 'ish-select-order-template-modal',
  templateUrl: './select-order-template-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOrderTemplateModalComponent implements OnInit, OnDestroy {
  @Input() product: Product;

  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  /**
   * submit successfull event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; title: string }>();

  preferredOrderTemplate: OrderTemplate;
  updateOrderTemplateForm: FormGroup;
  orderTemplateOptions: SelectOption[];

  showForm: boolean;
  newOrderTemplateInitValue = '';

  modal: NgbModalRef;

  idAfterCreate = '';
  private destroy$ = new Subject<void>();

  // tslint:disable-next-line:no-any
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<any>;

  constructor(
    private ngbModal: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private orderTemplatesFacade: OrderTemplatesFacade
  ) {}

  ngOnInit() {
    this.orderTemplatesFacade.preferredOrderTemplate$
      .pipe(take(1))
      .subscribe(orderTemplate => (this.preferredOrderTemplate = orderTemplate));
    this.determineSelectOptions();
    this.formInit();
    this.orderTemplatesFacade.currentOrderTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(orderTemplate => (this.idAfterCreate = orderTemplate && orderTemplate.id));

    this.translate
      .get('account.order_template.new_order_template.text')
      .pipe(take(1))
      .subscribe(res => {
        this.newOrderTemplateInitValue = res;
        this.setDefaultFormValues();
      });
    this.updateOrderTemplateForm.valueChanges.subscribe(changes => {
      if (changes.orderTemplate !== 'newTemplate') {
        this.updateOrderTemplateForm.get('newOrderTemplate').clearValidators();
      } else {
        this.updateOrderTemplateForm.get('newOrderTemplate').setValidators(Validators.required);
      }
      this.updateOrderTemplateForm.get('newOrderTemplate').updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private formInit() {
    this.updateOrderTemplateForm = this.fb.group({
      orderTemplate: [
        this.orderTemplateOptions && this.orderTemplateOptions.length > 0
          ? this.orderTemplateOptions[0].value
          : 'newTemplate',
        Validators.required,
      ],
      newOrderTemplate: [this.newOrderTemplateInitValue, Validators.required],
    });
  }

  private determineSelectOptions() {
    let currentOrderTemplate: OrderTemplate;
    this.orderTemplatesFacade.currentOrderTemplate$.pipe(take(1)).subscribe(w => (currentOrderTemplate = w));
    this.orderTemplatesFacade.orderTemplates$.pipe(takeUntil(this.destroy$)).subscribe(orderTemplates => {
      if (orderTemplates && orderTemplates.length > 0) {
        this.orderTemplateOptions = orderTemplates.map(orderTemplate => ({
          value: orderTemplate.id,
          label: orderTemplate.title,
        }));
        if (this.addMoveProduct === 'move' && currentOrderTemplate) {
          this.orderTemplateOptions = this.orderTemplateOptions.filter(
            option => option.value !== currentOrderTemplate.id
          );
        }
      } else {
        this.orderTemplateOptions = [];
      }
      this.setDefaultFormValues();
      this.addProductToPreferredOrderTemplate();
    });
  }

  private setDefaultFormValues() {
    if (this.showForm && !this.addProductToPreferredOrderTemplate()) {
      if (this.orderTemplateOptions && this.orderTemplateOptions.length > 0) {
        if (this.preferredOrderTemplate) {
          this.updateOrderTemplateForm.get('orderTemplate').setValue(this.preferredOrderTemplate.id);
        } else {
          this.updateOrderTemplateForm.get('orderTemplate').setValue(this.orderTemplateOptions[0].value);
        }
      } else {
        this.updateOrderTemplateForm.get('orderTemplate').setValue('newTemplate');
      }
      this.updateOrderTemplateForm.get('newOrderTemplate').setValue(this.newOrderTemplateInitValue);
    }
  }

  /* don't show order template selection form but add a product immediately if there is a preferred order template */
  private addProductToPreferredOrderTemplate(): boolean {
    if (this.showForm && this.preferredOrderTemplate && this.addMoveProduct === 'add') {
      this.updateOrderTemplateForm.get('orderTemplate').setValue(this.preferredOrderTemplate.id);
      this.submitForm();
      return true;
    }
    return false;
  }

  /** emit results when the form is valid */
  submitForm() {
    if (this.updateOrderTemplateForm.valid) {
      const orderTemplateId = this.updateOrderTemplateForm.get('orderTemplate').value;
      this.submitEmitter.emit({
        id: orderTemplateId !== 'newTemplate' ? orderTemplateId : undefined,
        title:
          orderTemplateId !== 'newTemplate'
            ? this.orderTemplateOptions.find(option => option.value === orderTemplateId).label
            : this.updateOrderTemplateForm.get('newOrderTemplate').value,
      });
      this.showForm = false;
    } else {
      markAsDirtyRecursive(this.updateOrderTemplateForm);
    }
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.setDefaultFormValues();
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  /* *  returns the title of the selected order template */
  get selectedOrderTemplateTitle(): string {
    const selectedValue = this.updateOrderTemplateForm.get('orderTemplate').value;
    if (selectedValue === 'newTemplate') {
      return this.updateOrderTemplateForm.get('newOrderTemplate').value;
    } else {
      return this.orderTemplateOptions.find(orderTemplate => orderTemplate.value === selectedValue).label;
    }
  }

  /** returns the route to the selected order template */
  get selectedOrderTemplateRoute(): string {
    const selectedValue = this.updateOrderTemplateForm.get('orderTemplate').value;
    if (selectedValue === 'newTemplate') {
      return `route://account/order-templates/${this.idAfterCreate}`;
    } else {
      return `route://account/order-templates/${selectedValue}`;
    }
  }

  /** activates the input field to create a new order template */
  get newOrderTemplateDisabled() {
    const selectedOrderTemplate = this.updateOrderTemplateForm.get('orderTemplate').value;
    return selectedOrderTemplate !== 'newTemplate';
  }

  /** translation key for the modal header */
  get headerTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.order_template.add_to_template.button.add_to_template.label'
      : 'account.order_template.table.options.move_to_template';
  }

  /** translation key for the submit button */
  get submitButtonTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.order_template.add_to_template.button.add_to_template.label'
      : 'account.order_template.table.options.move_to_template';
  }

  /** translation key for the success text */
  get successTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'account.order_template.added.confirmation'
      : 'account.order_template.move.added.text';
  }
}
