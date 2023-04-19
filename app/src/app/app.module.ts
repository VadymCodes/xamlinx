import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbCarouselModule, NgbAccordionModule, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { ExamModule } from './modules/exam/exam.module';
import { RequestModule } from './modules/request/request.module';
import { AdminModule } from './modules/admin/admin.module';
import { SettingModule } from './modules/setting/setting.module';
import { GroupModule } from './modules/group/group.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutComponent } from './components/about/about.component';
import { HowWorkComponent } from './components/how-work/how-work.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ConfirmModalService } from './components/confirm-modal/confirm-modal.service';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { PolicyComponent } from './components/policy/policy.component';
import { ReviewerModule } from './modules/reviewer/reviewer.module';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { FaqsComponent } from './components/faqs/faqs.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    HowWorkComponent,
    VerifyEmailComponent,
    ConfirmModalComponent,
    TermsConditionsComponent,
    PolicyComponent,
    ToastContainerComponent,
    FaqsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    AuthModule,
    FontAwesomeModule,
    NgbToastModule,
    NgbCarouselModule,
    NgbAccordionModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfirmModalService,
  ],
  entryComponents: [ConfirmModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
