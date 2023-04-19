import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { Constants } from '../shared/constants';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser: any = this.authenticationService.currentUserValue;
    if (currentUser) {
      switch (route.data.permission) {
        case Constants.CAN_UPLOAD:
          return currentUser.can_upload;
          break;

        case Constants.CAN_REQUEST:
          return currentUser.verified;
          break;
        
        default:
          return true;
          break;
      }
    }

    // not permitted in so redirect to home page
    this.router.navigate(['/']);
    return false;
  }
}