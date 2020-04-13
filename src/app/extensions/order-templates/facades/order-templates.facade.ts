import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getOrderTemplatesState } from '../store/order-templates-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrderTemplatesFacade {
  constructor(private store: Store<{}>) {}

  // example for debugging
  orderTemplatesState$ = this.store.pipe(select(getOrderTemplatesState));
}
