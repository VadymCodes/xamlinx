import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, switchMap, take } from 'rxjs/operators';

import { SettingService, UserService } from '@/services/index';
import { PaymentMethod } from '@/models/index';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';
import { iif, of } from 'rxjs';
import { Setting } from '@/models/setting';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  availableMethods: Record<string, boolean> = {};
  paymentMethods: PaymentMethod[] = [];
  paymentMethodForm = this.formBuilder.group({
    type: [null, Validators.required],
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });
  submitting = false; // Whether the request is being sent
  submitted = false;
  error = '';
  loading = false; // Whether loading for data

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private settingService: SettingService,
    private cacheService: CacheService,
  ) {
    this.cacheService
      .getCached(Constants.CACHE_KEYS.ALL_PAYMENT_METHODS)
      .pipe(
        take(1),
        switchMap((methods) =>
          iif(
            () => Boolean(methods),
            of(methods as Setting<Record<string, boolean>>),
            this.settingService.getAvailablePaymentMethods()
          )
        )
      )
      .subscribe((methods) => {
        if (methods) {
          for (let item in methods.value) {
            if (!methods.value[item]) {
              delete methods.value[item];
            }
          }
          this.availableMethods = methods.value;
        }
      });
  }

  ngOnInit(): void {
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this.loading = true;
    this.cacheService
      .getCached(Constants.CACHE_KEYS.USER_PAYMENT_METHODS)
      .pipe(
        take(1),
        switchMap((methods) =>
          iif(
            () => Boolean(methods),
            of(methods as any[]),
            this.userService.getPaymentMethods()
          )
        )
      )
      .subscribe({
        next: (res) => {
          this.paymentMethods = res;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  get f() { return this.paymentMethodForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.paymentMethodForm.invalid) {
        return;
    }

    this.submitting = true;

    this.userService.savePaymentMethod(
      this.f.email.value,
      this.f.type.value.toLowerCase()
    )
      .pipe(first())
      .subscribe(
        data => {
          this.getPaymentMethods();
          this.submitting = false;
        },
        error => {
          this.error = error;
          this.submitting = false;
        });
  }

  removePaymentMethod(id: number) {
    this.userService.removePaymentMethod(id)
      .pipe(first())
      .subscribe(
        data => {
          this.getPaymentMethods();
        },
        error => {
          this.error = error;
        });
  }

}
