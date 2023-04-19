import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '@/services';
import { ToastService } from '@/services/toast.service';

@Injectable({ providedIn: 'root' })
export class VerifyStateGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser && currentUser.verified) {
      return true;
    }

    // Show toast to inform the user
    if (currentUser) {
      // If the user already signed in
      this.toastService.show({
        content:
          'Please verify your email! The features you were trying to access are only available to verified users!',
        type: 'danger',
      });
    }

    return false;
  }
}
