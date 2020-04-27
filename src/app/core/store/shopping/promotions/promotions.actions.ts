import { createAction, props } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
export const loadPromotion = createAction(
  '[Promotions Internal] Load Promotion',
  props<{ payload: { promoId: string } }>()
);
export const loadPromotionFail = createAction(
  '[Promotions API] Load Promotion Fail',
  props<{ payload: { error: HttpError; promoId: string } }>()
);
export const loadPromotionSuccess = createAction(
  '[Promotions API] Load Promotion Success',
  props<{ payload: { promotion: Promotion } }>()
);
