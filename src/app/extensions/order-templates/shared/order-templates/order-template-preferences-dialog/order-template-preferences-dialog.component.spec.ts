import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { OrderTemplatePreferencesDialogComponent } from './order-template-preferences-dialog.component';

describe('OrderTemplatePreferencesDialogComponent', () => {
  let component: OrderTemplatePreferencesDialogComponent;
  let fixture: ComponentFixture<OrderTemplatePreferencesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTemplatePreferencesDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTemplatePreferencesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
