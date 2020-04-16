import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatePreferencesDialogComponent } from './shared/order-templates/order-template-preferences-dialog/order-template-preferences-dialog.component';
import { SelectOrderTemplateModalComponent } from './shared/order-templates/select-order-template-modal/select-order-template-modal.component';
import { OrderTemplatesStoreModule } from './store/order-templates-store.module';

@NgModule({
  imports: [OrderTemplatesStoreModule, SharedModule],
  declarations: [OrderTemplatePreferencesDialogComponent, SelectOrderTemplateModalComponent],
  exports: [OrderTemplatePreferencesDialogComponent, SelectOrderTemplateModalComponent],
  entryComponents: [],
})
export class OrderTemplatesModule {}
