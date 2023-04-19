import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  // Forgot password form
  form = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
  });

  loading = false; // Whether the request is being sent
  submitted = false; // Whether the user has sent the request for once
  success = false; // Whether the request has successed

  error = ''; // Error information if the request is rejected

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() { return this.form.controls; }

  /**
   * Form submit event handler.
   * Send the forgot password API request if the form is valid.
   */
  onSubmit() {
    this.submitted = true; // Allow showing form error below the inputs

    // Stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true; // Disable the submit button and show loading icon

    // Send the API request to reset password
    this.authenticationService.forgot(this.f.email.value)
      .pipe(first())
      .subscribe(
        data => {
          this.success = true;
          this.loading = false;
          this.error = '';
        },
        error => {
          this.error = error; // Show error in the error section
          this.loading = false;
        });
  }

}
