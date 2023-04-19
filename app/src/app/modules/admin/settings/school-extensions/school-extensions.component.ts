import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Country, School } from '@/models';
import { CountryService, SchoolService } from '@/services';
import { ToastService } from '@/services/toast.service';
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-school-extensions',
  templateUrl: './school-extensions.component.html',
  styleUrls: ['./school-extensions.component.scss'],
})
export class SchoolExtensionsComponent implements OnInit {
  countries: Country[] = []; // Fetched countries
  schools: School[] = []; // Fetched schools
  extensions: any[] = []; // Fetched school extensions

  // Icons
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;

  // Form
  form: FormGroup;

  // States
  loadings = {
    countries: false,
    schools: false,
    extension: false,
  };

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private schoolService: SchoolService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      country: [undefined, Validators.required],
      school: [undefined, Validators.required],
      newExtension: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Fetch countries
    this.loadings.countries = true;

    this.countryService
      .getAll()
      .pipe(
        finalize(() => {
          this.loadings.countries = false;
        })
      )
      .subscribe((countries) => {
        this.countries = countries;
      });

    // Subscription to check if the country field has changed or not in order to fetch schools
    this.form.get('country')?.valueChanges.subscribe((countryId) => {
      // Check if the user select a country or deselect
      if (countryId) {
        this.loadings.schools = true;

        this.schoolService
          .getByCountry(countryId)
          .pipe(
            finalize(() => {
              this.loadings.schools = false;
            })
          )
          .subscribe((schools) => {
            this.schools = schools;
          });
      } else {
        this.schools = [];
      }
    });

    // Subscription to check if the school field has changed in order to set the extensions
    this.form.get('school')?.valueChanges.subscribe((schoolId) => {
      const school = this.schools.find((s) => s.id === schoolId);

      if (schoolId !== undefined && school) {
        this.extensions = school.school_abbreviation;
      } else {
        // Resetting school's extensions and new extension input field
        this.extensions = [];
        this.form.get('newExtension')?.setValue('');
        this.form.get('newExtension')?.updateValueAndValidity();
      }
    });
  }

  /**
   * Send the POST API to the server to remove abbreviation
   * @param abbreviation Selected school's abbreviation
   */
  private _onRemoveAbbreviation(abbreviation: string) {
    const schoolId = this.form.get('school')?.value;

    this.loadings.extension = true;

    this.schoolService.removeAbbreviation(schoolId, abbreviation).subscribe(
      () => {
        // Resetting new extension input field
        this.form.get('newExtension')?.setValue('');
        this.form.get('newExtension')?.updateValueAndValidity();

        this.extensions = this.extensions.filter((ex) => ex !== abbreviation);

        // Show success toast
        this.toastService.show({
          content: 'Removed abbreviation!',
          type: 'success',
        });
      },
      (error) => {
        // Show error taost
        this.toastService.show({
          content: error,
          type: 'danger',
        });
      },
      () => {
        this.loadings.extension = false;
      }
    );
  }

  /**
   * Add extension event handler
   */
  onAddExtension() {
    if (this.form.valid && !this.loadings.extension) {
      const schoolId = Number(this.form.get('school')?.value as string);
      const abbreviation = this.form.get('newExtension')?.value as string;

      this.loadings.extension = true;

      this.schoolService.addAbbreviation(schoolId, abbreviation).subscribe(
        () => {
          // Resetting new extension input field
          this.form.get('newExtension')?.setValue('');
          this.form.get('newExtension')?.updateValueAndValidity();

          this.extensions.push(abbreviation);

          // Show success toast
          this.toastService.show({
            content: 'Added new abbreviation!',
            type: 'success',
          });
        },
        (error) => {
          // Show error taost
          this.toastService.show({
            content: error,
            type: 'danger',
          });
        },
        () => {
          this.loadings.extension = false;
        }
      );
    }
  }

  /**
   * Delete school's abbreviation event handler
   * Show an confirmation modal. After the user has confirmed the action the request API will be sent
   * @param modal Reference to the modal ng-template
   * @param abbreviation Selected school's abbreviation
   */
  onConfirmRemove(modal: TemplateRef<ElementRef>, abbreviation: string) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: 'confirmation-modal',
        centered: true,
      })
      .result.then((isConfirmed: boolean) => {
        if (isConfirmed) {
          this._onRemoveAbbreviation(abbreviation);
        }
      });
  }
}
