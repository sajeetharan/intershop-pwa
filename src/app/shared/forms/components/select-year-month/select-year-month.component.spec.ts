import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormsSharedModule } from '../../forms.module';

import { SelectYearMonthComponent } from './select-year-month.component';

describe('Select Year Month Component', () => {
  let component: SelectYearMonthComponent;
  let fixture: ComponentFixture<SelectYearMonthComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsSharedModule, TranslateModule.forRoot()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SelectYearMonthComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          month: new FormControl(''),
          year: new FormControl('', [Validators.required]),
        });
        component.form = form;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName[0]).toEqual('month');
    expect(component.controlName[1]).toEqual('year');
    expect(component.label).toEqual('checkout.credit_card.expiration_date.label');
  });

  it('should display a month and a year select box after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=month]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=year]')).toBeTruthy();
  });
});
