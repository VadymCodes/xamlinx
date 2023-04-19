import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-leave-button',
  templateUrl: './leave-button.component.html',
  styleUrls: ['./leave-button.component.scss']
})
export class LeaveButtonComponent {
  constructor(
    private location: Location // Angular's service that applications can use to interact with a browser's URL.
  ) { }

  /**
   * 'Leave' button's event listener.
   * When called the browser will navigate back one step in the browser's history.
   */
  onLeave() {
    this.location.back(); // Navigates back in the platform's history.
  }
}
