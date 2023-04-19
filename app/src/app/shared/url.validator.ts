import { AbstractControl, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (!control.value) {
      return {message: 'Url is required'};
    }
    const regex = new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?");
    const containAt = regex.test(control.value);
    return !containAt ? {message: 'Invalid url'} : null;
  };
}