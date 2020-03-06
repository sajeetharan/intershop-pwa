import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-search-page',
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchTerm$: Observable<string>;
  numberOfItems$: Observable<number>;
  searchLoading$: Observable<boolean>;
  deviceType$: Observable<DeviceType>;
  filterParams: string;
  numberOfItems: number;

  private destroy$ = new Subject();

  constructor(
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchTerm$ = this.shoppingFacade.searchTerm$;
    this.numberOfItems$ = this.shoppingFacade.searchItemsCount$;
    this.searchLoading$ = this.shoppingFacade.searchLoading$;
    this.deviceType$ = this.appFacade.deviceType$;
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => (this.filterParams = params.get('filters')));
    this.shoppingFacade.searchItemsCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(numberOfItems => (this.numberOfItems = numberOfItems));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
