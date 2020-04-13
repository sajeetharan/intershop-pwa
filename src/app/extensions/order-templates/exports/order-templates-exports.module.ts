import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

@NgModule({
  imports: [
    FeatureToggleModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-order-templates',
      loadChildren: '../order-templates.module#OrderTemplatesModule',
    }),
  ],
  declarations: [],
  exports: [],
})
export class OrderTemplatesExportsModule {}
