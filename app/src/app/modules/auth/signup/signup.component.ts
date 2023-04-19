import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, first, switchMap, take } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { Country } from '@/models/country';
import { School } from '@/models/school';
import { AuthenticationService } from '@/services/authentication.service';
import { CountryService } from '@/services/country.service';
import { SchoolService } from '@/services/school.service';
import { schoolEmailValidator } from '@/shared/school-email.directive';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private subscription: Subscription = {} as Subscription;

  // Signup form
  signupForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    countryId: [null, Validators.required],
    schoolId: [null, Validators.required],
    schoolAbbreviation: [null, Validators.required],
    hasSchoolEmail: true,
    email: ['', schoolEmailValidator()],
    affiliated: true,
    document: null,
    password: ['', Validators.required]
  });

  countries: Country[] = [];
  schools: School[] = [];

  loading = false; // Whether the request is being sent
  submitted = false; // Whether the user has sent the request for once

  error = ''; // Error information if the request is rejected

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private countryService: CountryService,
    private schoolService: SchoolService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    // Initally fetch all the available countries
    this.countryService.getAll().pipe(first()).subscribe(countries => {
      this.countries = countries;
    });

    // Watching for whenever the 'hasSchoolEmail' field's value changes
    this.subscription = this.signupForm.controls['hasSchoolEmail'].valueChanges.subscribe(value => {
      if (value) {
        this.signupForm.controls['email'].setValidators([schoolEmailValidator()]);
      } else {
        this.signupForm.controls['email'].setValidators(Validators.compose([Validators.required, Validators.email]));
        if (this.signupForm.controls['affiliated'].value) {
          this.signupForm.controls['document'].setValidators(Validators.required);
          this.signupForm.controls['document'].updateValueAndValidity();
        } else {
          this.signupForm.controls['document'].clearValidators();
          this.signupForm.controls['document'].updateValueAndValidity();
        }
      }
      this.signupForm.controls['email'].updateValueAndValidity();
    });

    // Watch for whenever the 'schoolId' field's value changes
    this.signupForm.get('schoolId')?.valueChanges.subscribe(() => {
      this.signupForm.get('schoolAbbreviation')?.setValue(null); // Reset the school abbreviation select field
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() { return this.signupForm.controls; }

  /**
   * Populate the schools information by calling the get API
   */
  getSchools() {
    if (this.f.countryId.value) { // Checking if the user has selected any country
      // Calling API to get the schools by country ID
      this.schoolService.getByCountry(this.f.countryId.value).pipe(first()).subscribe(schools => {
        this.schools = schools;
      });
    }
  }

  /**
   * Get school abbreviation array by school ID whenever the user select any school
   * @returns School abbreviation array or empty array if not found
   */
  getSchoolAbbreviation() {
    const school = this.schools.find(school => school.id === this.f.schoolId.value);

    return school ? school.school_abbreviation : [];
  }

  /**
   * Form submit event handler.
   * Send the signup API request if the form is valid
   */
  onSubmit() {
    this.submitted = true; // Allow showing form error below the inputs

    // Stop here if form is invalid
    if (this.signupForm.invalid) {
        return;
    }

    this.loading = true; // Disable the submit button and show loading icon

    // Get captcha client token
    this.recaptchaV3Service
      .execute('signup')
      .pipe(
        take(1),
        // Verify the token
        switchMap((token) => this.authenticationService
        .signup(
          this.f.firstName.value,
          this.f.lastName.value,
          this.f.schoolId.value,
          this.f.email.value + '@' + this.f.schoolAbbreviation.value,
          this.f.password.value,
          token
        )
        .pipe(first())),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.error = error; // Show error in the error section
        }
      );
  }
}
