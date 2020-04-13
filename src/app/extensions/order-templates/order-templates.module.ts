import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderTemplateListComponent } from './pages/account-order-template/account-order-template-list/account-order-template-list.component';
import { AccountOrderTemplateComponent } from './pages/account-order-template/account-order-template.component';
import { OrderTemplatesStoreModule } from './store/order-templates-store.module';

@NgModule({
  imports: [OrderTemplatesStoreModule, SharedModule],
  declarations: [AccountOrderTemplateComponent, AccountOrderTemplateListComponent],
  exports: [SharedModule],
  entryComponents: [],
})
export class OrderTemplatesModule {}
