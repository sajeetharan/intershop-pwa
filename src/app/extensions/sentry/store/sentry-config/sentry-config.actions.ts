import { createAction, props } from '@ngrx/store';
export const setSentryConfig = createAction('[Sentry] Set Config', props<{ payload: { dsn: string } }>());
