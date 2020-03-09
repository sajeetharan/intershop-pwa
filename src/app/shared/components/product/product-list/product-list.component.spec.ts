import { ComponentFixture, TestBed, async, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadProductsForCategory } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: HTMLElement;
  let store$: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      declarations: [MockComponent(LoadingComponent), MockComponent(ProductItemComponent), ProductListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
    store$ = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product tile when viewType is grid', () => {
    component.viewType = 'grid';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;
    expect(productItemContainer.configuration.displayType).toEqual('tile');
  });

  it('should render a product row when viewType is list', () => {
    component.viewType = 'list';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;
    expect(productItemContainer.configuration.displayType).toEqual('row');
  });

  it('should display loading when product list is loading', fakeAsync(() => {
    component.products = [];
    store$.dispatch(new LoadProductsForCategory({ categoryId: 'foo', page: 1, sorting: undefined }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-loading']);
  }));
});
