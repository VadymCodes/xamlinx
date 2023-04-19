import { ModifiableConstant } from '@/models/modifiable-constant';
import { SettingService } from '@/services';
import { ToastService } from '@/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-business-constants',
  templateUrl: './business-constants.component.html',
  styleUrls: ['./business-constants.component.scss'],
})
export class BusinessConstantsComponent implements OnInit {
  constants: ModifiableConstant[] = [];
  submitting = false; // Whether the update request is being sent
  fetching = false; // Whether the constants are being fetched

  form = this.fb.group({
    constant: [undefined, Validators.required], // Selected constant
    oldValue: [{ value: 0, disabled: true }, Validators.required], // The old value
    newValue: [0, Validators.required], // The new inputing value
  });

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Fetching constants
    this.fetching = true;
    this.settingService.getModifiableConstants().subscribe((constants) => {
      this.constants = constants;
      this.fetching = false;
    });

    // Patch the old constant value to the form whether the user select a constant
    this.form
      .get('constant')!
      .valueChanges.subscribe((value: ModifiableConstant) => {
        this.form.patchValue({
          oldValue: value.const_value,
        });
      });
  }

  /**
   * Save changes button click event handler
   * Send the request to the server to update the constant
   */
  onSubmit() {
    // Check if the form in valid
    if (this.form.invalid) {
      return;
    }

    // Get the selected constant name
    const CONSTANT_NAME = (
      this.form.get('constant')!.value as ModifiableConstant
    ).const_name;
    // Get the new inputed value
    const CONSTANT_VALUE = this.form.get('newValue')!.value;

    // Create the request
    const request = {
      name: CONSTANT_NAME,
      value: Number.isNaN(CONSTANT_VALUE) // Check if the inputed value is number or not
        ? CONSTANT_VALUE
        : Number(CONSTANT_VALUE),
    };

    // Send the request to the sever
    this.submitting = true;
    this.settingService.updateModifiableConstant(request).subscribe(
      () => {
        this.toastService.show({
          content: 'Successfully updated the constant',
          type: 'success',
        });
      },
      () => {
        this.toastService.show({
          content: 'There was an error while updating the constant',
          type: 'danger',
        });
      },
      () => {
        this.submitting = false;
      }
    );
  }
}
