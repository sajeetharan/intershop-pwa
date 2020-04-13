export interface OrderTemplatesState {}

// TODO: use createFeatureSelector after ivy dynamic loading
// tslint:disable-next-line: no-any
export const getOrderTemplatesState: (state: any) => OrderTemplatesState = state => state.orderTemplates;
