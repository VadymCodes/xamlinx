import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReviewerExamsComponent } from './exams/exams.component';
import { ExamInfoComponent } from './exam-info/exam-info.component';
import { ExamReviewComponent } from './exam-review/exam-review.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'exams',
        component: ReviewerExamsComponent,
      },
      {
        path: 'exams/:id',
        component: ExamInfoComponent,
      },
      {
        path: 'exams/:id/review',
        component: ExamReviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewerRoutingModule {}
