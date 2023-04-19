import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Request } from '../models/request';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getAll() {
    return this.http
      .get<Request[]>(`${environment.apiUrl}/requests`)
      .pipe(
        tap((requests) =>
          this.cacheService.cache(Constants.CACHE_KEYS.ALL_REQUESTS, requests)
        )
      );
  }

  getByUser() {
    return this.http
      .get<Request[]>(`${environment.apiUrl}/requests/get-by-user`)
      .pipe(
        tap((requests) =>
          this.cacheService.cache(Constants.CACHE_KEYS.USER_REQUESTS, requests)
        )
      );
  }

  getById(id: number) {
    return this.http.get<Request[]>(`${environment.apiUrl}/requests/${id}`);
  }

  create(request: any) {
    return this.http.post<Request[]>(`${environment.apiUrl}/requests/create`, request).pipe(tap(() => this.clearCached()));
  }

  dismiss(requestId: number) {
    return this.http.get<Request[]>(`${environment.apiUrl}/requests/dismiss/${requestId}`).pipe(tap(() => this.clearCached()));
  }

  delete(requestId: number) {
    return this.http.get<Request[]>(`${environment.apiUrl}/requests/delete/${requestId}`).pipe(tap(() => this.clearCached()));
  }

  findMatch(requestId: number) {
    return this.http.get<Request[]>(`${environment.apiUrl}/admin/requests/find-match/${requestId}`);
  }

  assignExam(data: any) {
    return this.http.post<Request[]>(`${environment.apiUrl}/admin/requests/assign`, {id: data.id, payout: data.payout}).pipe(tap(() => this.clearCached()));
  }

  purchase(email: string, requestId: number, examId: number) {
    return this.http.post<Request[]>(`${environment.apiUrl}/requests/${requestId}/purchase`, {
      email: email,
      exam_id: examId
    }).pipe(tap(() => this.clearCached()));
  }

  clearCached() {
    this.cacheService.clear(Constants.CACHE_KEYS.ALL_REQUESTS);
    this.cacheService.clear(Constants.CACHE_KEYS.USER_REQUESTS);
  }
}
