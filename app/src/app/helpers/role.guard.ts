import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { Constants } from '../shared/constants';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser: any = this.authenticationService.currentUserValue;
    if (currentUser) {
      if ((route.data.roles as string[]).includes(currentUser.role.name)) {
        return true;
      } else {
        let url: string;

        switch (currentUser.role.name) {
          case Constants.ROLE_ADMIN:
            url = Constants.DEFAULT_ADMIN_ROUTE;
            break;
          case Constants.ROLE_REVIEWER:
            url = Constants.DEFAULT_REVIEWER_ROUTE;
            break;
          default:
            url = Constants.DEFAULT_STUDENT_ROUTE;
        }

        this.router.navigate([url]);
        return false;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
