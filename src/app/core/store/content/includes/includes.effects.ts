import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { identity } from 'rxjs';
import { groupBy, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { logoutUser } from 'ish-core/store/user';
import { mapErrorToActionV8, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  loadContentInclude,
  loadContentIncludeFail,
  loadContentIncludeSuccess,
  resetContentIncludes,
} from './includes.actions';

@Injectable()
export class IncludesEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  loadContentInclude$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContentInclude),
      mapToPayloadProperty('includeId'),
      groupBy(identity),
      mergeMap(group$ =>
        group$.pipe(
          switchMap(includeId =>
            this.cmsService.getContentInclude(includeId).pipe(
              map(contentInclude => loadContentIncludeSuccess({ payload: contentInclude })),
              mapErrorToActionV8(loadContentIncludeFail)
            )
          )
        )
      )
    )
  );
  resetContentIncludesAfterLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      mapTo(resetContentIncludes())
    )
  );
}
