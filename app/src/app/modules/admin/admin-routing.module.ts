import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { DemandsComponent } from './demands/demands.component';
import { DetailDemandComponent } from './detail-demand/detail-demand.component';
import { SuppliesComponent } from './supplies/supplies.component';
import { DetailSupplyComponent } from './detail-supply/detail-supply.component';
import { SettingsComponent } from './settings/settings.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { GroupListComponent } from './group-list/group-list.component';
import { DetailGroupComponent } from './detail-group/detail-group.component';
import { ReviewersComponent } from './reviewers/reviewers.component';
import { DetailReviewerComponent } from './detail-reviewer/detail-reviewer.component';
import { ForwardExamComponent } from './forward-exam/forward-exam.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/:id',
    component: DetailUserComponent,
  },
  {
    path: 'demands',
    component: DemandsComponent,
  },
  {
    path: 'demands/:id',
    component: DetailDemandComponent,
  },
  {
    path: 'supplies',
    component: SuppliesComponent,
  },
  {
    path: 'supplies/forward',
    component: ForwardExamComponent,
  },
  {
    path: 'supplies/:id',
    component: DetailSupplyComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'settings/available-methods',
    component: SettingsComponent,
  },
  {
    path: 'settings/watermark',
    component: SettingsComponent,
  },
  {
    path: 'payouts',
    component: PayoutsComponent,
  },
  {
    path: 'group-list',
    component: GroupListComponent,
  },
  {
    path: 'group-list/:id',
    component: DetailGroupComponent,
  },
  {
    path: 'reviewers',
    component: ReviewersComponent,
  },
  {
    path: 'reviewers/:id',
    component: DetailReviewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
