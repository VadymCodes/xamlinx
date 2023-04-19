import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User, PaymentMethod } from '../models/index';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getStudents() {
    return this.http.get<User[]>(`${environment.apiUrl}/students`).pipe(
      tap((students) => {
        this.cacheService.cache<User[]>(Constants.CACHE_KEYS.ALL_STUDENTS, students);
      })
    );
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  suspend(id: number) {
    return this.http.post<User>(`${environment.apiUrl}/users/suspend`, {id: id}).pipe(tap(() => this.clearUserCached()));
  }

  restore(id: number) {
    return this.http.post<User>(`${environment.apiUrl}/users/restore`, {id: id}).pipe(tap(() => this.clearUserCached()));
  }

  getPaymentMethods() {
    return this.http
      .get<PaymentMethod[]>(`${environment.apiUrl}/users/get-payment-methods`)
      .pipe(
        tap((methods) =>
          this.cacheService.cache(
            Constants.CACHE_KEYS.USER_PAYMENT_METHODS,
            methods
          )
        )
      );
  }

  savePaymentMethod(email: string, type: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/save-payment-method`, {
      email: email,
      type: type
    }).pipe(tap(() => this.clearUserMethodsCached()));
  }

  removePaymentMethod(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/users/remove-payment-method/${id}`).pipe(tap(() => this.clearUserMethodsCached()));
  }

  verifyEmail(code: string) {
    return this.http.get<any>(`${environment.apiUrl}/verify-email/${code}`).pipe(tap(() => this.clearUserCached()));
  }

  updateMe(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/update-me`, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    });
  }

  clearUserCached() {
    this.cacheService.clear(Constants.CACHE_KEYS.ALL_STUDENTS);
  }

  clearUserMethodsCached() {
    this.cacheService.clear(Constants.CACHE_KEYS.USER_PAYMENT_METHODS);
  }
}
