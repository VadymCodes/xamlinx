import { NgModule } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from '@/shared/shared.module';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [SharedModule, AuthRoutingModule, RecaptchaV3Module],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.CAPTCHA_V3_SITE_KEY,
    },
  ],
})
export class AuthModule {}
