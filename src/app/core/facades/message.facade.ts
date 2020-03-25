import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { MessagesPayloadType, ToastMessage } from 'ish-core/store/messages';

@Injectable({ providedIn: 'root' })
export class MessageFacade {
  constructor(private store: Store<{}>) {}

  info(data: MessagesPayloadType) {
    this.store.dispatch(new ToastMessage({ ...data, messageType: 'info' }));
  }

  error(data: MessagesPayloadType) {
    this.store.dispatch(new ToastMessage({ ...data, messageType: 'error' }));
  }

  warn(data: MessagesPayloadType) {
    this.store.dispatch(new ToastMessage({ ...data, messageType: 'warning' }));
  }

  success(data: MessagesPayloadType) {
    this.store.dispatch(new ToastMessage({ ...data, messageType: 'success' }));
  }
}
