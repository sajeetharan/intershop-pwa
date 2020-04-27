import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { ContactService } from 'ish-core/services/contact/contact.service';
import { mapErrorToActionV8, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  createContact,
  createContactFail,
  createContactSuccess,
  loadContact,
  loadContactFail,
  loadContactSuccess,
} from './contact.actions';

@Injectable()
export class ContactEffects {
  constructor(private actions$: Actions, private contactService: ContactService) {}

  loadSubjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContact),
      concatMap(() =>
        this.contactService.getContactSubjects().pipe(
          map(subjects => loadContactSuccess({ payload: { subjects } })),
          mapErrorToActionV8(loadContactFail)
        )
      )
    )
  );
  createContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createContact),
      mapToPayloadProperty('contact'),
      concatMap(contact =>
        this.contactService.createContactRequest(contact).pipe(
          mapTo(createContactSuccess()),
          mapErrorToActionV8(createContactFail)
        )
      )
    )
  );
}
