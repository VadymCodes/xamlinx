import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Constants } from '@/shared/constants';
import { PermissionGuard } from '@/helpers/permission.guard';
import { RequestsComponent } from './requests/requests.component';
import { AddRequestComponent } from './add-request/add-request.component';
import { DetailRequestComponent } from './detail-request/detail-request.component';
import { PurchaseComponent } from './purchase/purchase.component';

const routes: Routes = [
  {
    path: '',
    component: RequestsComponent,
  },
  {
    path: 'new',
    component: AddRequestComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: Constants.CAN_REQUEST,
    },
  },
  {
    path: 'detail/:id',
    component: DetailRequestComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: Constants.CAN_REQUEST,
    },
  },
  {
    path: 'purchase',
    component: PurchaseComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: Constants.CAN_REQUEST,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
