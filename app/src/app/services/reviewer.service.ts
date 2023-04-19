import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Reviewer } from '@/models/reviewer';
import { environment } from 'src/environments/environment';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';
import { Exam } from '@/models/exam';

export type ReviewerForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  school_id: number;
  disciplines: number[];
  levels: number[];
  subjects: number[];
};

export type Competenecy = {
  discipline_id: number;
  level_id: number;
  subject_id: number;
};

type QuestionsAndSolutions = {
  question: string;
  solution: string;
};

export type ReviewExam = {
  exam_id: number;
  result: 'revision' | 'original';
  questions_and_solutions: QuestionsAndSolutions[];
};

@Injectable({ providedIn: 'root' })
export class ReviewerService {
  private _adminEndpoint = `${environment.apiUrl}/admin/reviewers`;
  private _reviewerEndpoint = `${environment.apiUrl}/reviewers`;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getAllReviewers() {
    return this.http
      .get<Reviewer[]>(`${this._adminEndpoint}`)
      .pipe(
        tap((reviewers) =>
          this.cacheService.cache<Reviewer[]>(
            Constants.CACHE_KEYS.ALL_REVIEWERS,
            reviewers
          )
        )
      );
  }

  getReviewer(id: number) {
    return this.http
      .get<{ reviewer: Reviewer }>(`${this._adminEndpoint}/${id}`)
      .pipe(map((result) => result.reviewer));
  }

  createReviewer(form: ReviewerForm): Observable<void> {
    return this.http
      .post<void>(`${this._adminEndpoint}`, form)
      .pipe(
        tap(() => this.cacheService.clear(Constants.CACHE_KEYS.ALL_REVIEWERS))
      );
  }

  updateReviewer(reviewerId: number, form: ReviewerForm): Observable<void> {
    return this.http
      .post<void>(`${this._adminEndpoint}/update/${reviewerId}`, form)
      .pipe(
        tap(() => this.cacheService.clear(Constants.CACHE_KEYS.ALL_REVIEWERS))
      );
  }

  requestReview(examId: number, reviewerIds: number[]) {
    return this.http.post<void>(`${this._adminEndpoint}/request-review`, {
      exam_id: examId,
      reviewers_ids: reviewerIds,
    });
  }

  getReviewerByCompetency(competency: Competenecy) {
    return this.http
      .post<{ reviewers: Reviewer[] }>(
        `${this._adminEndpoint}/get-by-competency`,
        competency
      )
      .pipe(map((result) => result.reviewers));
  }

  getReviewableExams() {
    return this.http
      .get<{ reviews: Exam[] }>(`${this._reviewerEndpoint}/get-exams`)
      .pipe(
        map((result) => {
          const exams = result.reviews;

          this.cacheService.cache(
            Constants.CACHE_KEYS.REVIEWER_REVIEWABLE_EXAMS,
            exams
          );

          return exams;
        })
      );
  }

  reviewExam(payload: ReviewExam) {
    return this.http.post(`${this._reviewerEndpoint}/review-exam`, payload);
  }
}
