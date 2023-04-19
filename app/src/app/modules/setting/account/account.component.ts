import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription  } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuthenticationService, UserService } from '@/services/index';
import { ConfirmedValidator } from '@/shared/confirm.validator';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  private subscription: Subscription;
  userForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    verified: [false, Validators.required],
    newPassword: '',
    confirmPassword: ''
  }, {
    validator: ConfirmedValidator('newPassword', 'confirmPassword')
  });
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.subscription = this.authenticationService.currentUser.subscribe((user: any) => {
      this.setUserData(user);
    });
  }

  ngOnInit(): void {
  }

  setUserData(user: any) {
    this.f.firstName.setValue(user.firstName);
    this.f.lastName.setValue(user.lastName);
    this.f.email.setValue(user.email);
    this.f.verified.setValue(user.verified);
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }

    this.loading = true;
    this.userService.updateMe(this.f.firstName.value, this.f.lastName.value, this.f.email.value, this.f.newPassword.value)
      .pipe(first())
      .subscribe(
        data => {
          this.error = '';
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
