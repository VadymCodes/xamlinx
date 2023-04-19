import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

type WORKS_SECTION = 'PROVIDE' | 'REQUEST';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('aboutSection') aboutSection: ElementRef<HTMLDivElement> = {} as ElementRef; // Ref to about us section -> <section #aboutSection ...>
  aboutAnimated = false; // Whether the about section has executed the fade in animation.
  selectedWorksSection: WORKS_SECTION | null = null; // The selected 'How it works' sub section.

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  /**
   * Navigate to the requests page when executed.
   */
  goRequestPage() {
    this.router.navigate(['requests']);
  }

  /**
   * Navigate to the exams page when executed.
   */
  goUploadPage() {
    this.router.navigate(['exams']);
  }

  /**
   * Window on scroll event handlers.
   * Checking whether user has scrolled down to the about us section to show the fade in animation for the section.
   */
  @HostListener('window:scroll', ['$event']) // Window scroll events
  onScroll() {
    const bounding = this.aboutSection.nativeElement.getBoundingClientRect(); // Get bounding information of the about us section
    const bottom = bounding.bottom; // Get offset to the current viewport bottom.
    const top = bounding.top; // Get offset to the current viewport top.

    // Checking if the user has scrolled to the abous us section and the fade in animation hasn't started
    if (top < window.innerHeight && bottom >= 0 && !this.aboutAnimated) {
      this.aboutAnimated = true; // Trigger the animation.
    }
  }

  /**
   * 'How it works' section's 'Provide mock exam' and 'Request mock exam' click event handler.
   * Render the subsection based on which button is being clicked. If the button is clicked twice then clear the current selected.
   * @param section The selected button, either 'Provide mock exam' or 'Request mock exam'. Possible value is 'PROVIDE' or 'REQUEST' based on selected section.
   */
  selectWorksSection(section: WORKS_SECTION) {
    if (section && section === this.selectedWorksSection) {
      this.selectedWorksSection = null;
      return;
    }

    this.selectedWorksSection = section;
  }
}
