import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ProductAddToOrderTemplateComponent } from './product-add-to-order-template.component';

describe('ProductAddToOrderTemplateComponent', () => {
  let component: ProductAddToOrderTemplateComponent;
  let fixture: ComponentFixture<ProductAddToOrderTemplateComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductAddToOrderTemplateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
