import { createAction, props } from '@ngrx/store';

import { Contact } from 'ish-core/models/contact/contact.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
export const loadContact = createAction('[Contact Internal] Load Contact Subjects');
export const loadContactSuccess = createAction(
  '[Contact API] Load Contact Subjects Success',
  props<{ payload: { subjects: string[] } }>()
);
export const loadContactFail = createAction(
  '[Contact API] Load Contact Subjects Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createContact = createAction(
  '[Contact] Create Contact Us Request',
  props<{ payload: { contact: Contact } }>()
);
export const createContactFail = createAction(
  '[Contact API] Create Contact Us Request Fail',
  props<{ payload: { error: HttpError } }>()
);
export const createContactSuccess = createAction('[Contact API] Create Contact Us Request Success');
