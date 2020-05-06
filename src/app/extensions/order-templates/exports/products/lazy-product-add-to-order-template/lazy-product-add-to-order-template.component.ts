import { Product } from './../../../../../core/models/product/product.model';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-lazy-product-add-to-order-template',
  templateUrl: './lazy-product-add-to-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyProductAddToOrderTemplateComponent {
  @Input() product: Product;
  @Input() displayType?: string;
  @Input() quantity: number;
  @Input() class?: string;
  componentLocation = {
    moduleId: 'ish-extensions-order-templates',
    selector: 'ish-product-add-to-order-template',
  };
}
