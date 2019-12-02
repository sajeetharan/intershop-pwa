import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { FilterNavigationMapper } from 'ish-core/models/filter-navigation/filter-navigation.mapper';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Link } from 'ish-core/models/link/link.model';
import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { SearchParameterMapper } from 'ish-core/models/search-parameter/search-parameter.mapper';
import { SearchParameter } from 'ish-core/models/search-parameter/search-parameter.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private apiService: ApiService, private filterNavigationMapper: FilterNavigationMapper) {}

  getFilterForCategory(categoryUniqueId: string): Observable<FilterNavigation> {
    const categoryPath = categoryUniqueId.split('.').join('/');
    // TODO from REST
    return this.applyFilterWithCategory('', categoryPath).pipe(
      map(filter => this.filterNavigationMapper.fromData(filter)),
      map(filter => this.filterNavigationMapper.fixSearchParameters(filter))
    );
  }

  getFilterForSearch(searchTerm: string): Observable<FilterNavigation> {
    // tslint:disable-next-line:ish-no-object-literal-type-assertion
    const searchParameter = SearchParameterMapper.toData({ queryTerm: searchTerm } as SearchParameter);
    return this.apiService
      .get<FilterNavigationData>(`productfilters?${searchParameter}`, { skipApiErrorHandling: true })
      .pipe(
        map(filter => this.filterNavigationMapper.fromData(filter)),
        map(filter => this.filterNavigationMapper.fixSearchParameters(filter))
      );
  }

  applyFilter(searchParameter: URLFormParams): Observable<FilterNavigation> {
    const params = formParamsToString({ ...searchParameter, category: undefined });
    const categoryPath = searchParameter.category ? searchParameter.category[0] : undefined;
    return (categoryPath
      ? this.applyFilterWithCategory(params, categoryPath)
      : this.applyFilterWithoutCategory(params)
    ).pipe(
      map(filter => this.filterNavigationMapper.fromData(filter)),
      map(filter => this.filterNavigationMapper.fixSearchParameters(filter))
    );
  }

  getFilteredProducts(
    searchParameter: URLFormParams
  ): Observable<{ total: number; productSKUs: string[]; sortKeys: string[] }> {
    const params = formParamsToString({ ...searchParameter, category: undefined });
    const categoryPath = searchParameter.category ? searchParameter.category[0] : undefined;
    return (categoryPath
      ? this.getFilteredProductsWithCategory(params, categoryPath)
      : this.getFilteredProductsWithoutCategory(params)
    ).pipe(
      map((x: { total: number; elements: Link[]; sortKeys: string[] }) => ({
        productSKUs: x.elements.map(l => l.uri).map(ProductMapper.parseSKUfromURI),
        total: x.total,
        sortKeys: x.sortKeys,
      }))
    );
  }

  private getFilteredProductsWithoutCategory(searchParameter: string) {
    const params = (searchParameter ? `?${searchParameter}&` : '?') + 'returnSortKeys=true';
    return this.apiService.get(`products${params}`);
  }

  private getFilteredProductsWithCategory(searchParameter: string, category: string) {
    const params = (searchParameter ? `?${searchParameter}&` : '?') + 'returnSortKeys=true';
    return this.apiService.get(`categories/${category}/products${params}`);
  }

  private applyFilterWithoutCategory(searchParameter: string): Observable<FilterNavigationData> {
    const params = searchParameter ? `?${searchParameter}` : '';
    return this.apiService.get<FilterNavigationData>(`productfilters${params}`, {
      skipApiErrorHandling: true,
    });
  }

  private applyFilterWithCategory(searchParameter: string, category: string): Observable<FilterNavigationData> {
    const params = searchParameter ? `?${searchParameter}` : '';
    return this.apiService.get<FilterNavigationData>(`categories/${category}/productfilters${params}`, {
      skipApiErrorHandling: true,
    });
  }
}
