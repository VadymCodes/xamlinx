import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Request, Exam, Group } from '../models/index';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';
import { ExamMatch } from '@/models/exam-match';

const endpoint = `${environment.apiUrl}/admin`;

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getExamById(id: number) {
    return this.http.get<{ exam: Exam }>(`${endpoint}/exams/${id}`).pipe(map(res => res.exam));
  }

  markAsVerifiedExam(examId: number) {
    return this.http
      .post<any[]>(`${endpoint}/exams/mark-verified`, { id: examId })
      .pipe(
        tap(() => {
          this.cacheService.clear(Constants.CACHE_KEYS.ALL_EXAMS);
        })
      );
  }

  getAllGroups() {
    return this.http
      .get<Group[]>(`${endpoint}/groups`)
      .pipe(
        tap((groups) =>
          this.cacheService.cache<Group[]>(Constants.CACHE_KEYS.ALL_GROUPS, groups)
        )
      );
  }

  generatePDF(id: number) {
    return this.http.get<Group[]>(`${endpoint}/generate/${id}`);
  }

  getDemandById(id: number) {
    return this.http.get<Request[]>(`${endpoint}/requests/${id}`);
  }

  askToUpload(examId: number) {
    return this.http
      .post<Request[]>(`${endpoint}/exams/ask`, {
        exam_id: examId,
      })
      .pipe(
        tap(() => {
          this.cacheService.clear(Constants.CACHE_KEYS.ALL_EXAMS);
        })
      );
  }

  getPayableUsers() {
  	return this.http
      .get<ExamMatch[]>(`${endpoint}/get-payable-users`)
      .pipe(
        tap((payouts) =>
          this.cacheService.cache(Constants.CACHE_KEYS.ALL_PAYOUTS, payouts)
        )
      );
  }

  payout(paymentOption: string) {
    return this.http.post<any[]>(`${endpoint}/payout`, {
      payment_option: paymentOption
    });
  }
}
