import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { LeaveButtonComponent } from '@/components/leave-button/leave-button.component';
import { MathjaxComponent } from '@/components/mathjax/mathjax.component';

/**
 * A module to hold all the common-use components that would be used multiple times in the application.
 */
@NgModule({
  declarations: [LeaveButtonComponent, MathjaxComponent],
  imports: [
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ],
  exports: [
    LeaveButtonComponent,
    MathjaxComponent,
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class SharedModule {}
