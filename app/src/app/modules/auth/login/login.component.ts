import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, first, switchMap, take } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { throwError } from 'rxjs';

import { Constants } from '@/shared/constants';
import { AuthenticationService } from '@/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Login form
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });


  loading = false; // Whether the request is being sent
  submitted = false; // Whether the user has sent the request for once

  returnUrl = ''; // The url to redirect to when successfully logged in
  error = ''; // Error information if the request is rejected

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    // Get the current logged user
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser) { // Check if is there any logged user
      if (currentUser.role.name === Constants.ROLE_ADMIN) { // If the logged user's role is ADMIN
        this.router.navigate([Constants.DEFAULT_ADMIN_ROUTE]);
      } else {
        this.router.navigate([Constants.DEFAULT_STUDENT_ROUTE]);
      }
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] // Get the redirect url from the route params.
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() { return this.loginForm.controls; }

  /**
   * Form submit event handler.
   * Send the login API request if the form is valid.
   */
  onSubmit() {
    this.submitted = true; // Allow showing form error below the inputs

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true; // Disable the submit button and show loading icon

    // Get captcha client token
    this.recaptchaV3Service
      .execute('login')
      .pipe(
        take(1),
        // Verify the token
        switchMap((token) =>
          this.authenticationService
            .login(this.f.email.value, this.f.password.value, token)
            .pipe(first())
        ),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          const currentUser: any = this.authenticationService.currentUserValue;

          switch (currentUser.role.name) {
            case Constants.ROLE_ADMIN: // If the logged user's role is ADMIN
              this.returnUrl = this.returnUrl || Constants.DEFAULT_ADMIN_ROUTE; // If there's no return url then use default return url for ADMIN role
              break;
            case Constants.ROLE_REVIEWER:
              this.returnUrl =
                this.returnUrl || Constants.DEFAULT_REVIEWER_ROUTE; // If there's no return url then use default return url for REVIEWER role
              break;
            default:
              // If there's no return url then check if user has verified to use default return url for STUDENT role
              this.returnUrl = this.returnUrl || (currentUser.verified ? Constants.DEFAULT_STUDENT_ROUTE : '/');
          }

          this.router.navigate([this.returnUrl]); // Redirect to the return url
        },
        (error) => {
          this.error = error; // Show error in the error section
        }
      );
  }
}
