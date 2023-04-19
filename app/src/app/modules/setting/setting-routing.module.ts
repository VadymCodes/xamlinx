import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account/account.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { VerifyStateGuard } from '@/helpers/verify-state.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/setting/account',
    pathMatch: 'full',
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'payment-methods',
    component: PaymentMethodComponent,
    canActivate: [VerifyStateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
