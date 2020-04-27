import { createAction, props } from '@ngrx/store';

import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
export const setSeoAttributes = createAction('[SEO] Set Attributes', props<{ payload: Partial<SeoAttributes> }>());
