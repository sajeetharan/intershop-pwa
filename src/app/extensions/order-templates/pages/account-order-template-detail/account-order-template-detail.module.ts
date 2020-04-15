import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatesModule } from '../../order-templates.module';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';
import { AccountOrderTemplateDetailComponent } from './account-order-template-detail.component';

const accountOrderTemplateDetailPageRoutes: Routes = [
  {
    path: '',
    component: AccountOrderTemplateDetailComponent,
  },
];

@NgModule({
  imports: [OrderTemplatesModule, RouterModule.forChild(accountOrderTemplateDetailPageRoutes), SharedModule],
  declarations: [AccountOrderTemplateDetailComponent, AccountOrderTemplateDetailLineItemComponent],
})
export class AccountOrderTemplateDetailModule {}
