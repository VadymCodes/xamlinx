import { AbstractControl, ValidatorFn } from '@angular/forms';

export function schoolEmailValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
  	if (!control.value) {
  		return {message: 'Email is required'};
  	}
  	const regex = new RegExp("@");
    const containAt = regex.test(control.value);
    return containAt ? {message: 'Email is invalid'} : null;
  };
}