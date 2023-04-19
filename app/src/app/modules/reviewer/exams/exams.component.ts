import { Component, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { switchMap, take } from 'rxjs/operators';
import { iif, of } from 'rxjs';

import { ReviewerService } from '@/services/reviewer.service';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';
import { Exam } from '@/models';

@Component({
  selector: 'app-reviewer-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ReviewerExamsComponent implements OnInit {
  private _exams: Exam[] = []; // Fetched reviewable exams

  faEye = faEye; // View button icon
  loading = false; // Whether loading for data

  // Table props
  page = 1; // The current page
  pageSize = 5; // The current page size
  collectionSize = 0; // The amount of items on the table

  constructor(
    private reviewerService: ReviewerService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    // Fetch reviewable exams from cached or server
    this.cacheService
      .getCached<Exam[]>(Constants.CACHE_KEYS.REVIEWER_REVIEWABLE_EXAMS)
      .pipe(
        take(1),
        switchMap((exams) =>
          // Check whether exams has been cachedd
          iif(
            () => Boolean(exams),
            of(exams as Exam[]), // Return the cached exams
            this.reviewerService.getReviewableExams() // Switch to fetch from server
          )
        )
      )
      .subscribe({
        next: (exams) => {
          this._exams = exams;
          this.collectionSize = exams.length;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  get exams() {
    // Calculate the items needed to be shown on the table
    return this._exams.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  /**
   * Get the Bootstrap's badge type class name according to the exam status
   * @param status The status of the provided exam
   * @returns Bootstrap's badge type class
   */
   getBadgeClass(status: string) {
    switch (status) {
      case Constants.EXAM_STATUS.ACTIVE:
        return 'badge-success';
      case Constants.EXAM_STATUS.PENDING_ADMIN_REVIEW:
        return 'badge-primary';
      default:
        return 'badge-danger';
    }
  }
}
