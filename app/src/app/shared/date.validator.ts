import { AbstractControl, ValidatorFn } from '@angular/forms';

export function examDateValidate(mode: string, single_max_idle: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
  	if(control.value !== null) {
  		let currentDate = new Date();
	    currentDate.setHours(0,0,0,0);

	    let examDate = new Date(control.value);
	    examDate.setHours(0,0,0,0);

	    if(examDate > currentDate) {
	    	return {message: 'You are not allowed to supply mock exam before the actual exam date'};
	    }

	    if(mode === 'single') {
	    	let formattedDate = new Date(control.value);
		    formattedDate.setMonth(formattedDate.getMonth() + single_max_idle);
		    formattedDate.setHours(0,0,0,0);

		    if(currentDate > formattedDate) {
		    	return {message: 'You are not allowed to supply mock exam more than ' + single_max_idle + ' months after the actual exam date'};
		    }	
	    }
	    	
	    return null;
  	}
    return null;
  };
}