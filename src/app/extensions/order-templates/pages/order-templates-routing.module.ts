import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { FeatureToggleGuard } from 'ish-core/guards/feature-toggle.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account-order-template/account-order-template.module').then(m => m.AccountOrderTemplateModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'orderTemplates', breadcrumbData: [{ key: 'account.ordertemplates.link' }] },
  },
  {
    path: ':orderTemplateName',
    loadChildren: () =>
      import('./account-order-template-detail/account-order-template-detail.module').then(
        m => m.AccountOrderTemplateDetailModule
      ),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'orderTemplates' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderTemplatesRoutingModule {}
