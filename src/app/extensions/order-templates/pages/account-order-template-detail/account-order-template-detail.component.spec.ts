import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AccountOrderTemplateDetailComponent } from './account-order-template-detail.component';

describe('AccountOrderTemplateDetailComponent', () => {
  let component: AccountOrderTemplateDetailComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountOrderTemplateDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
