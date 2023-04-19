import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Constants } from '@/shared/constants';
import { PermissionGuard } from '@/helpers/permission.guard';
import { UploadsComponent } from './uploads/uploads.component';
import { AddExamComponent } from './add-exam/add-exam.component';
import { DetailExamComponent } from './detail-exam/detail-exam.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/exams/uploads',
    pathMatch: 'full',
  },
  {
    path: 'uploads',
    component: UploadsComponent,
  },
  {
    path: 'new',
    component: AddExamComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: Constants.CAN_UPLOAD,
    },
  },
  {
    path: 'detail/:id',
    component: DetailExamComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: Constants.CAN_UPLOAD,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule {}
