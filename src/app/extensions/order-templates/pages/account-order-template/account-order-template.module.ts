import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatesModule } from '../../order-templates.module';

import { AccountOrderTemplateListComponent } from './account-order-template-list/account-order-template-list.component';
import { AccountOrderTemplateComponent } from './account-order-template.component';

const accountOrderTemplatesPageRoutes: Routes = [
  {
    path: '',
    component: AccountOrderTemplateComponent,
  },
];

@NgModule({
  imports: [OrderTemplatesModule, RouterModule.forChild(accountOrderTemplatesPageRoutes), SharedModule],
  declarations: [AccountOrderTemplateComponent, AccountOrderTemplateListComponent],
})
export class AccountOrderTemplateModule {}
