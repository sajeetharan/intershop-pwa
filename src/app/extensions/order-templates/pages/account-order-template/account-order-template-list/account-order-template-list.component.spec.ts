import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { verify } from 'crypto';
import { MockComponent } from 'ng-mocks';
import { spy } from 'ts-mockito';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ProductAddToBasketComponent } from '../../../../../shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { AccountOrderTemplateListComponent } from './account-order-template-list.component';

describe('Account Order Template List Component', () => {
  let component: AccountOrderTemplateListComponent;
  let fixture: ComponentFixture<AccountOrderTemplateListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderTemplateListComponent,
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(ProductAddToBasketComponent),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit delete id when delete is called', () => {
    const emitter = spy(component.deleteOrderTemplate);

    component.delete('deleteId');

    verify(emitter.emit('deleteId')).once();
  });
});
