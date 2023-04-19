import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@/components/home/home.component';
import { AboutComponent } from '@/components/about/about.component';
import { HowWorkComponent } from '@/components/how-work/how-work.component';
import { VerifyEmailComponent } from '@/components/verify-email/verify-email.component';
import { TermsConditionsComponent } from '@/components/terms-conditions/terms-conditions.component';
import { PolicyComponent } from '@/components/policy/policy.component';
import { FaqsComponent } from '@/components/faqs/faqs.component';
import { RoleGuard } from './helpers/role.guard';
import { Constants } from './shared/constants';
import { VerifyStateGuard } from './helpers/verify-state.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'how-it-works',
    component: HowWorkComponent,
  },
  {
    path: 'verify-email/:code',
    component: VerifyEmailComponent,
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
  },
  {
    path: 'policy',
    component: PolicyComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: {
      roles: [Constants.ROLE_ADMIN],
    },
  },
  {
    path: 'exams',
    loadChildren: () => import('./modules/exam/exam.module').then(m => m.ExamModule),
    canActivate: [RoleGuard, VerifyStateGuard],
    data: {
      roles: [Constants.ROLE_STUDENT],
    },
  },
  {
    path: 'groups',
    loadChildren: () => import('./modules/group/group.module').then(m => m.GroupModule),
    canActivate: [RoleGuard, VerifyStateGuard],
    data: {
      roles: [Constants.ROLE_STUDENT],
    },
  },
  {
    path: 'requests',
    loadChildren: () => import('./modules/request/request.module').then(m => m.RequestModule),
    canActivate: [RoleGuard, VerifyStateGuard],
    data: {
      roles: [Constants.ROLE_STUDENT],
    },
  },
  {
    path: 'reviewer',
    loadChildren: () => import('./modules/reviewer/reviewer.module').then(m => m.ReviewerModule),
    canActivate: [RoleGuard, VerifyStateGuard],
    data: {
      roles: [Constants.ROLE_REVIEWER],
    },
  },
  {
    path: 'setting',
    loadChildren: () => import('./modules/setting/setting.module').then(m => m.SettingModule),
    canActivate: [ RoleGuard ],
    data: {
      roles: [Constants.ROLE_STUDENT, Constants.ROLE_REVIEWER]
    },
  },
  // otherwise redirect to home
  // { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
