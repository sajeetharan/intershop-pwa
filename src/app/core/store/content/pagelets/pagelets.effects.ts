import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapTo } from 'rxjs/operators';

import { logoutUser } from 'ish-core/store/user';

import { resetPagelets } from './pagelets.actions';

@Injectable()
export class PageletsEffects {
  constructor(private actions$: Actions) {}

  resetPageletsAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      mapTo(resetPagelets())
    )
  );
}
