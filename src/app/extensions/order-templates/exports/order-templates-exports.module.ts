import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyProductAddToOrderTemplateComponent } from './products/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';

@NgModule({
  imports: [
    FeatureToggleModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-order-templates',
      loadChildren: '../order-templates.module#OrderTemplatesModule',
    }),
  ],
  declarations: [LazyProductAddToOrderTemplateComponent],
  exports: [LazyProductAddToOrderTemplateComponent],
})
export class OrderTemplatesExportsModule {}
