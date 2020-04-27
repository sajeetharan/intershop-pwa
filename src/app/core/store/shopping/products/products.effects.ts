import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { identity } from 'rxjs';
import {
  concatMap,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { ProductsService } from 'ish-core/services/products/products.service';
import { selectRouteParam } from 'ish-core/store/router';
import { loadCategory } from 'ish-core/store/shopping/categories';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToActionV8,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import {
  loadProduct,
  loadProductBundlesSuccess,
  loadProductFail,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductLinksFail,
  loadProductLinksSuccess,
  loadProductSuccess,
  loadProductVariations,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  loadProductsForCategory,
  loadProductsForCategoryFail,
  loadRetailSetSuccess,
} from './products.actions';
import { getProductEntities, getSelectedProduct } from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private productsService: ProductsService,
    private httpStatusCodeService: HttpStatusCodeService,
    private productListingMapper: ProductListingMapper,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      mapToPayloadProperty('sku'),
      mergeMap(sku =>
        this.productsService.getProduct(sku).pipe(
          map(product => loadProductSuccess({ payload: { product } })),
          mapErrorToActionV8(loadProductFail, { sku })
        )
      )
    )
  );
  loadProductIfNotLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductIfNotLoaded),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getProductEntities))),
      filter(([{ sku, level }, entities]) => !ProductHelper.isSufficientlyLoaded(entities[sku], level)),
      groupBy(([{ sku }]) => sku),
      mergeMap(group$ =>
        group$.pipe(
          this.throttleOnBrowser(),
          map(([{ sku }]) => loadProduct({ payload: { sku } }))
        )
      )
    )
  );
  loadProductsForCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductsForCategory),
      mapToPayload(),
      map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
      concatMap(({ categoryId, page, sorting }) =>
        this.productsService.getCategoryProducts(categoryId, page, sorting).pipe(
          concatMap(({ total, products, sortKeys }) => [
            ...products.map(product => loadProductSuccess({ payload: { product } })),
            setProductListingPages({
              payload: this.productListingMapper.createPages(products.map(p => p.sku), 'category', categoryId, {
                startPage: page,
                sortKeys,
                sorting,
                itemCount: total,
              }),
            }),
          ]),
          mapErrorToActionV8(loadProductsForCategoryFail, { categoryId })
        )
      )
    )
  );
  loadProductBundles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => ProductHelper.isProductBundle(product)),
      mergeMap(({ sku }) =>
        this.productsService.getProductBundles(sku).pipe(
          mergeMap(({ stubs, bundledProducts }) => [
            ...stubs.map((product: Product) => loadProductSuccess({ payload: { product } })),
            loadProductBundlesSuccess({ payload: { sku, bundledProducts } }),
          ]),
          mapErrorToActionV8(loadProductFail, { sku })
        )
      )
    )
  );
  loadProductVariations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductVariations),
      mapToPayloadProperty('sku'),
      mergeMap(sku =>
        this.productsService.getProductVariations(sku).pipe(
          mergeMap(({ products: variations, defaultVariation }) => [
            ...variations.map((product: Product) => loadProductSuccess({ payload: { product } })),
            loadProductVariationsSuccess({
              payload: {
                sku,
                variations: variations.map(p => p.sku),
                defaultVariation,
              },
            }),
          ]),
          mapErrorToActionV8(loadProductVariationsFail, { sku })
        )
      )
    )
  );
  loadMasterProductForProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => ProductHelper.isVariationProduct(product)),
      withLatestFrom(this.store.pipe(select(getProductEntities))),
      filter(
        ([product, entities]: [VariationProduct, Dictionary<VariationProduct>]) => !entities[product.productMasterSKU]
      ),
      groupBy(([product]) => product.productMasterSKU),
      mergeMap(groups =>
        groups.pipe(
          this.throttleOnBrowser(),
          map(([product]) =>
            loadProductIfNotLoaded({
              payload: {
                sku: product.productMasterSKU,
                level: ProductCompletenessLevel.List,
              },
            })
          )
        )
      )
    )
  );
  loadProductVariationsForMasterProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => ProductHelper.isMasterProduct(product)),
      withLatestFrom(this.store.pipe(select(getProductEntities))),
      filter(
        ([product, entities]: [VariationProductMaster, Dictionary<VariationProductMaster>]) =>
          !entities[product.sku] || !entities[product.sku].variationSKUs
      ),
      groupBy(([product]) => product.sku),
      mergeMap(groups =>
        groups.pipe(
          this.throttleOnBrowser(),
          map(([product]) => loadProductVariations({ payload: { sku: product.sku } }))
        )
      )
    )
  );
  selectedProduct$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('sku')),
      whenTruthy(),
      map(sku => loadProduct({ payload: { sku } }))
    )
  );
  loadDefaultCategoryContextForProduct$ = createEffect(() =>
    this.store
      .pipe(
        ofProductUrl(),
        select(getSelectedProduct),
        withLatestFrom(this.store.pipe(select(selectRouteParam('categoryUniqueId')))),
        map(([product, categoryUniqueId]) => !categoryUniqueId && product),
        whenTruthy(),
        filter(p => !ProductHelper.isFailedLoading(p)),
        filter(product => !product.defaultCategory())
      )
      .pipe(
        mapToProperty('defaultCategoryId'),
        whenTruthy(),
        distinctUntilChanged(),
        map(categoryId => loadCategory({ payload: { categoryId } }))
      )
  );
  loadRetailSetProductDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(ProductHelper.isRetailSet),
      mapToProperty('sku'),
      map(sku =>
        loadProductIfNotLoaded({
          payload: {
            sku,
            level: ProductCompletenessLevel.Detail,
          },
        })
      )
    )
  );
  loadPartsOfRetailSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(ProductHelper.isRetailSet),
      mapToProperty('sku'),
      mergeMap(sku =>
        this.productsService
          .getRetailSetParts(sku)
          .pipe(
            mergeMap(stubs => [
              ...stubs.map((product: Product) => loadProductSuccess({ payload: { product } })),
              loadRetailSetSuccess({ payload: { sku, parts: stubs.map(p => p.sku) } }),
            ])
          )
      )
    )
  );
  redirectIfErrorInProducts$ = createEffect(
    () =>
      this.store.pipe(
        ofProductUrl(),
        select(getSelectedProduct),
        whenTruthy(),
        distinctUntilKeyChanged('sku'),
        filter(ProductHelper.isFailedLoading),
        tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
      ),
    { dispatch: false }
  );
  redirectIfErrorInCategoryProducts$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductsForCategoryFail),
        tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
      ),
    { dispatch: false }
  );
  loadProductLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductLinks),
      mapToPayloadProperty('sku'),
      distinct(),
      mergeMap(sku =>
        this.productsService.getProductLinks(sku).pipe(
          map(links => loadProductLinksSuccess({ payload: { sku, links } })),
          mapErrorToActionV8(loadProductLinksFail, { sku })
        )
      )
    )
  );
  loadLinkedCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductLinksSuccess),
      mapToPayloadProperty('links'),
      map(links =>
        Object.keys(links)
          .reduce((acc, val) => [...acc, ...(links[val].categories || [])], [])
          .filter((val, idx, arr) => arr.indexOf(val) === idx)
      ),
      mergeMap(ids => ids.map(categoryId => loadCategory({ payload: { categoryId } })))
    )
  );

  private throttleOnBrowser = () => (isPlatformBrowser(this.platformId) ? throttleTime(3000) : map(identity));
}
