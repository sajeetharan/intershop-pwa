import { Action } from '@ngrx/store';

export interface MessagesPayloadType {
  /**
   * required message (works with i18n)
   */
  message: string;

  /**
   * optional message-parameters (i18n)
   */
  messageParams?: { [id: string]: string };

  /**
   * optional title (works with i18n)
   */
  title?: string;

  /**
   * optional title-parameters (i18n)
   */
  titleParams?: { [id: string]: string };

  /**
   * in ms
   */
  duration?: number;

  /**
   * defines toast type
   */
  messageType?: 'info' | 'error' | 'warning' | 'success';
}

export enum MessagesActionTypes {
  ToastMessage = '[Message] Set Toast',
}

export class ToastMessage implements Action {
  readonly type = MessagesActionTypes.ToastMessage;
  constructor(public payload: MessagesPayloadType) {}
}

export type MessagesActions = ToastMessage;
