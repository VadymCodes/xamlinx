import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, switchMap, take } from 'rxjs/operators';
import { iif, of } from 'rxjs';

import { AdminService } from '@/services/index';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';
import { ExamMatch } from '@/models/exam-match';

@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss']
})
export class PayoutsComponent implements OnInit {

  matches: any[] = [];
  visibleMatches: any[] = [];
  payoutForm = this.formBuilder.group({
    paymentOption: ['paypal', Validators.required],
  });
  submitting = false; // Whether the request is being sent
  submitted = false;
  error = '';
  selectedMethod = 'paypal';
  loading = false; // Whether loading for data

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private cacheService: CacheService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.cacheService
      .getCached<any>(Constants.CACHE_KEYS.ALL_PAYOUTS)
      .pipe(
        take(1),
        switchMap((payouts) =>
          iif(
            () => Boolean(payouts),
            of(payouts as ExamMatch[]),
            this.adminService.getPayableUsers()
          )
        )
      )
      .subscribe({
        next: (res) => {
          this.matches = res;
          this.refreshTable(this.selectedMethod);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  selectPaymentMethod(option = 'paypal') {
    this.selectedMethod = option;
    this.refreshTable(option);
  }

  refreshTable(option: string) {
    this.visibleMatches = this.matches.map(match => {
      const paymentMethods = match.payment_methods.find((item: any) => item.type == option );
      if(paymentMethods) {
         match.payment_email = paymentMethods.payment_email;
         match.payment_type = paymentMethods.type;
         match.status = paymentMethods.status;
      } else {
        match.payment_email = 'Not provided';
        match.payment_type = '-';
        match.status = '-';
      }
      return match;
    });
  }

  get f() { return this.payoutForm.controls; }

  payout() {
    this.submitted = true;
    if (this.payoutForm.invalid) {
        return;
    }
    this.submitting = true;
    this.adminService.payout(this.f.paymentOption.value).pipe(first()).subscribe(res => {
      console.log(res);
      this.submitting = false;
    }, error => {
      this.error = error;
      this.submitting = false;
    });
  }

}
