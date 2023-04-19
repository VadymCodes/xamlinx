import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Constants } from '@/shared/constants';
import { AuthenticationService } from '@/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isCollapsed = true; // Whether the header has collapsed in the mobile view
  hasVerfied = false; // Whether the user has verified
  isLogged = false; // Whether the user has logged in
  isStudent = false; // Whether the logged user is student
  isAdmin = false; // Whether the logged user is admin
  isReviewer = false; // Whether the logged user is reviewer
  private authSubscription: Subscription; // Subscription to watch the current user state (logged in or not)

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.me().pipe(first()).subscribe(); // Initial authentication

    this.authSubscription = this.authenticationService.currentUser.subscribe(
      (user: any) => {
        if (user !== null) {
          // User logged in
          this.isLogged = true;

          // Check user role.
          this.isStudent = user.role.name === Constants.ROLE_STUDENT;
          this.isAdmin = user.role.name === Constants.ROLE_ADMIN;
          this.isReviewer = user.role.name === Constants.ROLE_REVIEWER;

          // Check user status
          this.hasVerfied = user.verified;
        } else {
          this.isLogged = false;
          this.isStudent = false;
          this.isAdmin = false;
          this.isReviewer = false;
          this.hasVerfied = false;
        }
      }
    );
  }

  ngOnInit(): void {}

  /**
   * Whether the user is on the About us page
   */
   get isOnAboutPage(): boolean {
    return this.router.url === '/about';
  }

  /**
   * Logout the logged user. After that redirect the user to the login page.
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
