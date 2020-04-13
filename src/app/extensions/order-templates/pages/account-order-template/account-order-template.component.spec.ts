import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AccountOrderTemplateComponent } from './account-order-template.component';

describe('Account Order Template Component', () => {
  let component: AccountOrderTemplateComponent;
  let fixture: ComponentFixture<AccountOrderTemplateComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountOrderTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
