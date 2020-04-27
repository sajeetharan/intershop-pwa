import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { MessagesPayloadType, toastMessage } from 'ish-core/store/messages';

@Injectable({ providedIn: 'root' })
export class MessageFacade {
  constructor(private store: Store<{}>) {}

  info(data: MessagesPayloadType) {
    this.store.dispatch(toastMessage({ payload: { ...data, messageType: 'info' } }));
  }

  error(data: MessagesPayloadType) {
    this.store.dispatch(toastMessage({ payload: { ...data, messageType: 'error' } }));
  }

  warn(data: MessagesPayloadType) {
    this.store.dispatch(toastMessage({ payload: { ...data, messageType: 'warning' } }));
  }

  success(data: MessagesPayloadType) {
    this.store.dispatch(toastMessage({ payload: { ...data, messageType: 'success' } }));
  }
}
