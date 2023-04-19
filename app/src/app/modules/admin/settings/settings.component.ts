import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _onDestroy$ = new Subject<void>();

  // Icons
  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;

  // School Extensions
  isExtensionsOpen = false;

  // Available Methods
  onAvailablePage = false;

  // Events
  onEventsPage = false;

  // Business Constants
  isConstantsOpen = false;

  // Watermark
  onWatermarkPage = false;

  // Viewport states
  screenTablet = false;
  screenMobile = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initializing
    // First check if the user on the available payment methods page
    this.checkUrl(this.router.url);
    // First check the viewport size
    this.onResize();

    // Checking if the user on the available payment methods page
    this.router.events
      .pipe(
        takeUntil(this._onDestroy$),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        const url = (event as NavigationEnd).url;

        this.checkUrl(url);
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;

    this.screenTablet = screenWidth > 576 && screenWidth <= 992;
    this.screenMobile = screenWidth <= 576;
  }

  /**
   * Getter for button arrow icon
   */
  getCaretIcon(state: boolean) {
    return state ? faCaretDown : faCaretRight;
  }

  /**
   * School extension button click event handler
   * Toggle the school extensions window state
   */
  onExtensionsClick() {
    this.isConstantsOpen = false;
    this.isExtensionsOpen = !this.isExtensionsOpen;
  }

  checkUrl(url: string) {
    this.onAvailablePage = url === '/admin/settings/available-methods';
    this.onEventsPage = url === '/admin/settings';
    this.onWatermarkPage = url === '/admin/settings/watermark';
  }

  /**
   * Business constants button click event handler
   * Toggle the business constants window state
   */
  onConstantsClick() {
    this.isExtensionsOpen = false;
    this.isConstantsOpen = !this.isConstantsOpen;
  }
}
