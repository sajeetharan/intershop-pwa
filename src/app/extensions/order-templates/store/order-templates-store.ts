import { OrderTemplateState } from './order-templates/order-template.reducer';

export interface OrderTemplatesState {
  orderTemplates: OrderTemplateState;
}

// TODO: use createFeatureSelector after ivy dynamic loading
// tslint:disable-next-line: no-any
export const getOrderTemplatesState: (state: any) => OrderTemplatesState = state => state.orderTemplates;
