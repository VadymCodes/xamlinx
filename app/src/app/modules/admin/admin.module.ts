import { NgModule } from '@angular/core';
import {
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { DemandsComponent } from './demands/demands.component';
import { SuppliesComponent } from './supplies/supplies.component';
import { DetailDemandComponent } from './detail-demand/detail-demand.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { DetailSupplyComponent } from './detail-supply/detail-supply.component';
import { SettingsComponent } from './settings/settings.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { GroupListComponent } from './group-list/group-list.component';
import { DetailGroupComponent } from './detail-group/detail-group.component';
import { ReviewersComponent } from './reviewers/reviewers.component';
import { DetailReviewerComponent } from './detail-reviewer/detail-reviewer.component';
import { SharedModule } from '@/shared/shared.module';
import { ForwardExamComponent } from './forward-exam/forward-exam.component';
import { ExamDetailComponent } from './forward-exam/exam-detail/exam-detail.component';
import { ReviewerDetailComponent } from './forward-exam/reviewer-detail/reviewer-detail.component';
import { AvailableMethodsComponent } from './settings/available-methods/available-methods.component';
import { SchoolExtensionsComponent } from './settings/school-extensions/school-extensions.component';
import { BusinessConstantsComponent } from './settings/business-constants/business-constants.component';
import { WatermarkComponent } from './settings/watermark/watermark.component';
import { EventsComponent } from './settings/events/events.component';

@NgModule({
  declarations: [
    UsersComponent,
    DemandsComponent,
    SuppliesComponent,
    DetailDemandComponent,
    DetailUserComponent,
    DetailSupplyComponent,
    SettingsComponent,
    PayoutsComponent,
    GroupListComponent,
    DetailGroupComponent,
    ReviewersComponent,
    DetailReviewerComponent,
    ForwardExamComponent,
    ExamDetailComponent,
    ReviewerDetailComponent,
    AvailableMethodsComponent,
    SchoolExtensionsComponent,
    BusinessConstantsComponent,
    WatermarkComponent,
    EventsComponent,
  ],
  imports: [
    NgbPaginationModule,
    AdminRoutingModule,
    SharedModule,
    NgbModalModule,
  ],
})
export class AdminModule {}
