import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ReviewerRoutingModule } from './reviewer-routing.module';
import { ReviewerExamsComponent } from './exams/exams.component';
import { SharedModule } from '@/shared/shared.module';
import { ExamInfoComponent } from './exam-info/exam-info.component';
import { ExamReviewComponent } from './exam-review/exam-review.component';

@NgModule({
  declarations: [
    ReviewerExamsComponent,
    ExamInfoComponent,
    ExamReviewComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgSelectModule,
    FontAwesomeModule,
    ReviewerRoutingModule,
  ],
})
export class ReviewerModule {}
