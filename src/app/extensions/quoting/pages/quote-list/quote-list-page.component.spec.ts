import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuoteData } from '../../models/quote/quote.interface';
import { loadQuotes, loadQuotesSuccess } from '../../store/quote';
import { loadQuoteRequests } from '../../store/quote-request';
import { quotingReducers } from '../../store/quoting-store.module';

import { QuoteListPageComponent } from './quote-list-page.component';
import { QuoteListComponent } from './quote-list/quote-list.component';

describe('Quote List Page Component', () => {
  let component: QuoteListPageComponent;
  let fixture: ComponentFixture<QuoteListPageComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(LoadingComponent), MockComponent(QuoteListComponent), QuoteListPageComponent],
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            quoting: combineReducers(quotingReducers),
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes loading', () => {
    store$.dispatch(loadQuotes());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render loading component if quote requests loading', () => {
    store$.dispatch(loadQuoteRequests());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render quote list component if quotes present', () => {
    const quotes = {
      quotes: [
        {
          id: 'test',
        } as QuoteData,
      ],
    };

    store$.dispatch(loadQuotesSuccess({ payload: quotes }));
    fixture.detectChanges();
    expect(element.querySelector('ish-quote-list')).toBeTruthy();
  });
});
