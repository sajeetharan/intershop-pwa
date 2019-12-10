import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { FilterData, FilterValueMap } from 'ish-core/models/filter/filter.interface';
import { getICMStaticURL } from 'ish-core/store/configuration';
import { stringToFormParams } from 'ish-core/utils/url-form-params';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigation } from './filter-navigation.model';

@Injectable({ providedIn: 'root' })
export class FilterNavigationMapper {
  private icmStaticURL: string;

  constructor(store: Store) {
    store.pipe(select(getICMStaticURL)).subscribe(url => (this.icmStaticURL = url));
  }

  fromData(data: FilterNavigationData): FilterNavigation {
    return {
      filter:
        data && data.elements
          ? data.elements.map(filterData => ({
              id: filterData.id,
              name: filterData.name,
              displayType: filterData.displayType,
              facets: this.mapFacetData(filterData),
              filterValueMap: this.parseFilterValueMap(filterData.filterValueMap),
              selectionType: filterData.selectionType || 'single',
            }))
          : [],
    };
  }

  /**
   * parse ish-link to
   */
  private parseFilterValueMapUrl(url: string) {
    const urlParts = url.split(':');
    return `${this.icmStaticURL}/${urlParts[0]}/-${urlParts[1]}`;
  }

  /**
   * parse FilterValueMap for image-links
   */
  private parseFilterValueMap(filterValueMap: FilterValueMap): FilterValueMap {
    return filterValueMap
      ? Object.keys(filterValueMap).reduce((acc, k) => {
          acc[k] = {
            mapping:
              filterValueMap[k].type === 'image'
                ? `url(${this.parseFilterValueMapUrl(filterValueMap[k].mapping)})`
                : filterValueMap[k].mapping,
            type: filterValueMap[k].type,
          };
          return acc;
        }, {})
      : {};
  }

  private mapFacetData(filterData: FilterData) {
    return filterData.filterEntries
      ? filterData.filterEntries.reduce((acc, facet) => {
          const category = facet.link.uri.includes('/categories/')
            ? [facet.link.uri.split('/productfilters')[0].split('/categories/')[1]]
            : undefined;
          if (facet.name !== 'Show all') {
            acc.push({
              name: facet.name,
              count: facet.count,
              selected: facet.selected,
              displayName: facet.displayValue || undefined,
              searchParameter: {
                ...stringToFormParams(facet.link.uri.split('?')[1] || ''),
                category,
              },
              level: facet.level || 0,
              mappedValue: facet.mappedValue || undefined,
            });
          } else {
            console.warn(`Limiting filters is not supported. Set limit to -1 in the BackOffice (${filterData.name})`);
          }
          return acc;
        }, [])
      : [];
  }
}
