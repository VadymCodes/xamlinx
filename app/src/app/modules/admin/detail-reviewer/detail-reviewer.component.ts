import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTimes, faEye, faRedo } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, Observable, of } from 'rxjs';
import { finalize, map, switchMap, take, tap } from 'rxjs/operators';

import { Country, School } from '@/models';
import { CountryService, ExamService, SchoolService } from '@/services';
import { Discipline } from '@/models/discipline';
import { Level } from '@/models/level';
import { Subject } from '@/models/subject';
import { ReviewerForm, ReviewerService } from '@/services/reviewer.service';
import { schoolEmailValidator } from '@/shared/school-email.directive';

type ArrayField = 'disciplines' | 'levels' | 'subjects';

type SelectValues = {
  countries: Country[];
  schools: School[];
  disciplines: Discipline[];
  levels: Level[];
  subjects: Subject[];
};

@Component({
  selector: 'app-detail-reviewer',
  templateUrl: './detail-reviewer.component.html',
  styleUrls: ['./detail-reviewer.component.scss'],
})
export class DetailReviewerComponent implements OnInit {
  private _reviewerId = 0; // The ID of the editing reviewer
  private readonly _generatePasswordLength = 8;

  // Icons
  faTimes = faTimes; // Select field delete icon
  faEye = faEye; // Password view icon
  faRedo = faRedo; // Re-generate password icon

  isAdd = false; // Whether adding new or editing existed reviewer
  isShowPassword = true;
  loadingPage = false; // Whether data is being fetched from server
  loadingSchools = false; // Whether schools data is being fetched from the server
  submitting = false; // Whether communicating to the server
  error = ''; // The response error message if server return failure

  // Form
  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', schoolEmailValidator()],
    password: [''],
    school_id: [undefined, Validators.required],
    schoolAbbreviation: [undefined, Validators.required],
    disciplines: this.fb.array([
      this.fb.control(undefined, Validators.required),
    ]),
    levels: this.fb.array([this.fb.control(undefined, Validators.required)]),
    subjects: this.fb.array([this.fb.control(undefined, Validators.required)]),
    country_id: [undefined],
  });
  submitted = false; // Whether the form has been submitted

  // Information for select fields
  selectValues: SelectValues = {
    countries: [],
    schools: [],
    disciplines: [],
    levels: [],
    subjects: [],
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private schoolService: SchoolService,
    private countryService: CountryService,
    private examService: ExamService,
    private reviewerService: ReviewerService
  ) {}

  ngOnInit(): void {
    // Check if the param has 'add' in it, if so then set the state to add new reviewer
    this.route.params.subscribe((params) => {
      this.isAdd = params['id'] === 'add';

      // If editing existed reviewer
      if (!this.isAdd) {
        this._reviewerId = Number(params['id']);
      } else {
        this.randomizePassword();
      }
    });

    this.loadingPage = true;

    combineLatest([
      this.countryService.getAll(), // Populate country select field
      this.examService.getAllDisciplines(), // Populate discipline select fields
      this.examService.getAllLevels(), // Populate level select fields
      this.examService.getAllSubjects(), // Populate subject select fields
    ])
      .pipe(
        map(([countries, disciplines, levels, subjects]) => ({
          countries,
          disciplines,
          levels,
          subjects,
        })),
        switchMap(({ countries, disciplines, levels, subjects }) => {
          // Populating fetched fields
          this.selectValues = {
            ...this.selectValues,
            countries,
            disciplines,
            levels,
            subjects,
          };

          if (!this.isAdd) {
            return this.reviewerService.getReviewer(this._reviewerId).pipe(
              switchMap(
                ({
                  firstName,
                  lastName,
                  email,
                  school_id,
                  school,
                  competencies,
                  temp_password,
                }) => {
                  const { disciplines, levels, subjects } = competencies;
                  const countryId = school.country?.id as number;

                  // Get all the schoolds belong to the fetched reviewer's country
                  return this.schoolService.getByCountry(countryId).pipe(
                    tap((schools) => {
                      this.selectValues.schools = schools;

                      this.populateFormArray('disciplines', disciplines);
                      this.populateFormArray('levels', levels);
                      this.populateFormArray('subjects', subjects);

                      this.form.patchValue({
                        first_name: firstName,
                        last_name: lastName,
                        email: email.slice(0, email.indexOf('@')), // Remove the school abbreviation
                        country_id: countryId,
                        school_id,
                        schoolAbbreviation: email.slice(email.indexOf('@')),
                        password: temp_password || '', // Check if the temp password has been changed
                      });
                    })
                  );
                }
              )
            );
          }

          return of();
        }),
        finalize(() => (this.loadingPage = false))
      )
      .subscribe(() => {});

    // Watch for whenever the 'school_id' field's value changes
    this.form.get('school_id')?.valueChanges.subscribe(() => {
      this.form.get('schoolAbbreviation')?.setValue(undefined); // Reset the school abbreviation select field
    });
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() {
    return this.form.controls;
  }

  /**
   * Getter for global loading
   */
  get loading() {
    return this.loadingPage || this.loadingSchools;
  }

  /**
   * Populate value to the form array for editing existed reviewer
   * @param field The name of the field to be populated
   * @param arrayId The array of IDs belong to the reviewer
   */
  populateFormArray(field: ArrayField, arrayId: number[]) {
    this.getFormArray(field).clear(); // Reset the form array

    for (const id of arrayId) {
      this.getFormArray(field).push(this.fb.control(id, Validators.required));
    }
  }

  /**
   * Generate random string for reviewer password
   * Source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
   */
  randomizePassword() {
    let password = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < this._generatePasswordLength; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    this.form.get('password')?.setValue(password);
  }

  /**
   * Convenience getter for easy access to form array
   */
  getFormArray(field: ArrayField) {
    return this.form.get(field) as FormArray;
  }

  /**
   * Convenience getter for easy access to filtered selectable values
   */
  getFilteredValues(field: ArrayField, index: number) {
    // For populating fetched reviewer competencies information when editing
    if (!this.isAdd && this.getFormArray(field).at(index)?.value) {
      return this.selectValues[field];
    }

    // Filter out selected values to avoid duplicate
    return this.selectValues[field].filter(
      (v) => !(this.getFormArray(field).value as number[]).includes(v.id)
    );
  }

  /**
   * Get school abbreviation array by school ID whenever the user select any school
   * @returns School abbreviation array or empty array if not found
   */
  getSchoolAbbreviation() {
    const school = this.selectValues.schools.find(
      (school) => school.id === this.f.school_id.value
    );

    return school ? school.school_abbreviation : [];
  }

  /**
   * Country select field event handler.
   * Whenever the user select a country the schools belong to the selected country will be fetched
   */
  onCountryChange() {
    const countryId = this.form.get('country_id')?.value;

    // Reset the school select field
    this.selectValues.schools = [];
    this.f.school_id.setValue(undefined);

    // Check if the user select a country or deselect
    if (countryId) {
      this.loadingSchools = true;

      this.schoolService
        .getByCountry(countryId)
        .pipe(finalize(() => (this.loadingSchools = false)))
        .subscribe((schools) => {
          this.selectValues.schools = schools;
        });
    }
  }

  /**
   * Add select field handler. When clicked a new field will be added to the provided form array
   * @param formArray The form array to add new field into
   */
  onAddSelect(formArray: FormArray) {
    formArray.push(this.fb.control(undefined, Validators.required));
  }

  /**
   * Delete select field handler. When clicked delete the field with the index from the provided form array
   * @param formArray The form array to delete field
   * @param index The index of the field to be deleted
   */
  onDeleteSelect(formArray: FormArray, index: number) {
    // Not allow to delete all fields
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }

  /**
   * Change the password field visibility state
   */
  onChangePasswordState() {
    this.isShowPassword = !this.isShowPassword;
  }

  /**
   * Form submit event handler.
   * Send the create reviewer form to the server if the form is valid.
   */
  onSubmit() {
    this.submitted = true; // Allow showing form error below the inputs

    // Stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.submitting = true; // Disable the submit button and show loading icon

    let subscription: Observable<void>;
    const formValue = this.form.value as ReviewerForm;
    formValue.email = formValue.email + '@' + this.f.schoolAbbreviation.value;

    if (this.isAdd) {
      // The API request to create reviewer
      subscription = this.reviewerService.createReviewer(formValue);
    } else {
      // The API request to edit reviewer
      subscription = this.reviewerService.updateReviewer(
        this._reviewerId,
        formValue
      );
    }

    subscription.pipe(take(1)).subscribe(
      () => {
        this.router.navigate(['/admin', 'reviewers']); // Navigate back to table page
        return;
      },
      (error) => {
        // Weird behaviour
        if (error === 'OK') {
          this.router.navigate(['/admin', 'reviewers']); // Navigate back to table page
          return;
        }

        this.error = error; // Show error in the error section
        this.submitting = false;
      }
    );
  }
}
