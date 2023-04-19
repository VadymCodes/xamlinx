import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@/services/authentication.service';
import { ConfirmedValidator } from '@/shared/confirm.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // Reset password form
  form = this.formBuilder.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validator: ConfirmedValidator('password', 'confirmPassword') // Same new password and confirm password validation
  });

  loading = false; // Whether the request is being sent
  submitted = false; // Whether the user has sent the request for once

  token = ''; // Reset password token
  error = ''; // Error information if the request is rejected

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.token = route.snapshot.params['token']; // Get the token from the url params

    // Checking the token validation
    this.authenticationService.checkToken(this.token).subscribe(() => {
      this.error = '';
    }, error => {
      this.error = error; // Show error in the error section
    });
  }

  ngOnInit(): void {
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() { return this.form.controls; }

  /**
   * Form submit event handler.
   * Send the reset password API request if the form is valid.
   */
  onSubmit() {
    this.submitted = true; // Allow showing form error below the inputs

    // Stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true; // Disable the submit button and show loading icon

    // Send the API request to reset password.
    this.authenticationService.resetPassword(this.token, this.f.password.value)
      .pipe(first())
      .subscribe(
        () => {
          this.error = '';
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error => {
          this.error = error; // Show error in the error section
          this.loading = false;
        });
  }

}
