import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User|null>;
  public currentUser: Observable<User|null>;

  constructor(private http: HttpClient, private cacheService: CacheService) {
    let user = localStorage.getItem('currentUser');
    if (user === null) {
      user = 'null';
    }
    this.currentUserSubject = new BehaviorSubject<User|null>(JSON.parse(user));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User|null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, recaptchaResponse: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password, recaptchaResponse })
      .pipe(map(response => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        let currentUser = response.user;
        currentUser.token = response.access_token;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
        return currentUser;
      }));
  }

  signup(firstName: string, lastName: string, schoolId: number, email: string, password: string, recaptchaResponse: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/signup`, { firstName, lastName, schoolId, email, password, recaptchaResponse })
      .pipe(map(response => {
        let currentUser = response.user;
        currentUser.token = response.access_token;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
        return currentUser;
      }));
  }

  me() {
    return this.http.get<any>(`${environment.apiUrl}/auth/me`)
      .pipe(map(response => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        let currentUser = response.user;
        currentUser.token = response.access_token;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
        return currentUser;
      }));
  }

  forgot(email: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/forgot-password`, {email: email})
      .pipe(map(response => {
        return response;
      }));
  }

  checkToken(token: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/check-reset-token`, {token: token})
      .pipe(map(response => {
        return response;
      }));
  }

  resetPassword(token: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/reset-password`, {
      token: token,
      password: password
    })
      .pipe(map(response => {
        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.cacheService.clearAll();
  }
}
