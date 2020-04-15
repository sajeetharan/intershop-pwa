import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item.component';

describe('Account Order Template Detail Line Item Component', () => {
  let component: AccountOrderTemplateDetailLineItemComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountOrderTemplateDetailLineItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
