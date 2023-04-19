import { NgModule } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { GroupRoutingModule } from './group-routing.module';
import { GroupsComponent } from './groups/groups.component';
import { SharedModule } from '@/shared/shared.module';
import { GroupQuestionsComponent } from './questions/questions.component';

@NgModule({
  declarations: [GroupsComponent, GroupQuestionsComponent],
  imports: [SharedModule, GroupRoutingModule, NgbPaginationModule],
})
export class GroupModule {}
