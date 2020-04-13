import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-account-order-template',
  templateUrl: './account-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateComponent {}
