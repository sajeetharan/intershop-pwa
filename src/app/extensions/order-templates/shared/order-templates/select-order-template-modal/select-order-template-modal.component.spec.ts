import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SelectOrderTemplateModalComponent } from './select-order-template-modal.component';

describe('SelectOrderTemplateModalComponent', () => {
  let component: SelectOrderTemplateModalComponent;
  let fixture: ComponentFixture<SelectOrderTemplateModalComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectOrderTemplateModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrderTemplateModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
