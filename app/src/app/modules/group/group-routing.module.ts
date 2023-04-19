import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupsComponent } from './groups/groups.component';
import { GroupQuestionsComponent } from './questions/questions.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
  },
  {
    path: 'questions/:id',
    component: GroupQuestionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule {}
