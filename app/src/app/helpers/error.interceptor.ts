import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        if (this.router.url !== '/' &&
          !this.router.url.includes('/login') &&
          this.router.url !== '/about' &&
          this.router.url !== '/signup' &&
          this.router.url !== '/how-it-works' &&
          this.router.url !== '/forgot-password' &&
          !this.router.url.includes('/reset-password') &&
          !this.router.url.includes('/#')) {
          location.reload(true);
        }
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}