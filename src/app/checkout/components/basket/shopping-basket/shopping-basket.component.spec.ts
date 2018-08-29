import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { spy, verify } from 'ts-mockito';

import { FormsSharedModule } from '../../../../forms/forms-shared.module';
import { HttpError } from '../../../../models/http-error/http-error.model';
import { FeatureToggleModule } from '../../../../shared/feature-toggle.module';
import { PipesModule } from '../../../../shared/pipes.module';
import { BasketMockData } from '../../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../../utils/dev/mock.component';

import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingBasketComponent,
        MockComponent({ selector: 'ish-modal-dialog', template: 'Modal Component', inputs: ['options'] }),
        MockComponent({
          selector: 'ish-line-item-list',
          template: 'Line Item List Component',
          inputs: ['lineItems'],
        }),
        MockComponent({
          selector: 'ish-basket-cost-summary',
          template: 'Basket Cost Summary Component',
          inputs: ['totals'],
        }),
        MockComponent({
          selector: 'ish-basket-add-to-quote',
          template: 'Baskt add To Quote Component',
        }),
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsSharedModule,
        PipesModule,
        FeatureToggleModule.testingFeatures({ quoting: true }),
      ],
      providers: [FormBuilder],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw deleteItem event when onDeleteItem is triggered.', done => {
    component.deleteItem.subscribe(firedItem => {
      expect(firedItem).toBe('4712');
      done();
    });

    component.onDeleteItem('4712');
  });

  it('should throw update item event when onUpdateItem is triggered.', done => {
    const payload = { itemId: 'IID', quantity: 1 };

    component.updateItem.subscribe(firedItem => {
      expect(firedItem).toBe(payload);
      done();
    });

    component.onUpdateItem(payload);
  });

  it('should throw addBasketToQuote event when addToQuote is triggered.', () => {
    const emitter = spy(component.addBasketToQuote);

    component.onAddToQuote();

    verify(emitter.emit()).once();
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = { status: 404 } as HttpError;
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeTruthy();
  });
});
