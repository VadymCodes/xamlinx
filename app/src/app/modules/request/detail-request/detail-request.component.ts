import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription  } from 'rxjs';
import { first } from 'rxjs/operators';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { StripeService } from 'ngx-stripe';
import { NgxSpinnerService } from "ngx-spinner";

import { RequestService, AuthenticationService } from '@/services/index';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.component.html',
  styleUrls: ['./detail-request.component.scss']
})
export class DetailRequestComponent implements OnInit {

  faFilePdf = faFilePdf;
  requestId: number;
  request: any;
  loading = false;
  error = '';
  user: any;
  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private stripeService: StripeService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService
  ) {
    this.requestId = route.snapshot.params['id'];
    this.getRequest();
    this.subscription = this.authenticationService.currentUser.subscribe((user: any) => {
      this.user = user;
    });
  }

  getRequest() {
    this.requestService.getById(this.requestId).pipe(first()).subscribe((res: any) => {
      this.request = res.request;
    });
  }

  ngOnInit(): void {
  }

  getSemester(value: number): any {
    const semesters = Constants.SEMESTERS;
    return semesters.find(s => s.value === value);
  }

  getMockExam(uploads: any[], type: string) {
    const upload = uploads.find(upload => upload.type === type);
    return upload.cloud_url;
  }

  goToPurchase(requestId: number, examId: number) {
    this.spinner.show();

    this.requestService.purchase(this.user.email, requestId, examId)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.stripeService.redirectToCheckout({
            sessionId: data.status.id
          }).subscribe(res => {
            this.spinner.hide();
          });
        },
        error => {
          this.error = error;
          this.spinner.hide();
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
