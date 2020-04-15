export interface OrderTemplateHeader {
  preferred: boolean;
  title: string;
}
export interface OrderTemplate extends OrderTemplateHeader {
  id: string;
  items?: OrderTemplateItem[];
  itemsCount?: number;
  public?: boolean;
}

export interface OrderTemplateItem {
  sku: string;
  id: string;
  creationDate: number;
  desiredQuantity: {
    value: number;
    unit?: string;
  };
  purchasedQuantity?: {
    value: number;
    unit: string;
  };
}
