import { NgModule } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ExamRoutingModule } from './exam-routing.module';
import { UploadsComponent } from './uploads/uploads.component';
import { AddExamComponent } from './add-exam/add-exam.component';
import { DetailExamComponent } from './detail-exam/detail-exam.component';
import { QuestionItemComponent } from './question-item/question-item.component';
import { SharedModule } from '@/shared/shared.module';

@NgModule({
  declarations: [
    UploadsComponent,
    AddExamComponent,
    DetailExamComponent,
    QuestionItemComponent
  ],
  imports: [NgbPaginationModule, ExamRoutingModule, SharedModule],
})
export class ExamModule {}
