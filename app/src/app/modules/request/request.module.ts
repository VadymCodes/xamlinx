import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStripeModule } from 'ngx-stripe';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { RequestRoutingModule } from './request-routing.module';
import { RequestsComponent } from './requests/requests.component';
import { DetailRequestComponent } from './detail-request/detail-request.component';
import { AddRequestComponent } from './add-request/add-request.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { environment } from '../../../environments/environment';
import { SharedModule } from '@/shared/shared.module';
import { RadioButtonComponent } from '@/components/radio-button/radio-button.component';

@NgModule({
  declarations: [
    RequestsComponent,
    DetailRequestComponent,
    AddRequestComponent,
    PurchaseComponent,
    RadioButtonComponent,
  ],
  imports: [
    NgbPaginationModule,
    NgxStripeModule.forRoot(environment.stripeKey),
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,
    RequestRoutingModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RequestModule {}
