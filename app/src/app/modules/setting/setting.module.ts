import { NgModule } from '@angular/core';

import { SettingRoutingModule } from './setting-routing.module';
import { AccountComponent } from './account/account.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { SharedModule } from '@/shared/shared.module';

@NgModule({
  declarations: [AccountComponent, PaymentMethodComponent],
  imports: [SharedModule, SettingRoutingModule],
})
export class SettingModule {}
