import { Component, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { iif, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';
import { Reviewer } from '@/models/reviewer';
import { ReviewerService } from '@/services/reviewer.service';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewers.component.html',
  styleUrls: ['./reviewers.component.scss'],
})
export class ReviewersComponent implements OnInit {
  faEye = faEye; // View icon for the action button
  loading = false; // Whether loading for data

  reviewers: Reviewer[] = []; // Fetched reviewers
  showReviewers: Reviewer[] = []; // The list of reviewers being shown on the table

  // Table props
  page = 1; // The current page
  pageSize = 5; // The current page size
  collectionSize = 0; // The amount of items on the table

  constructor(
    private reviewerService: ReviewerService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    // Fetch reviewers from cached or server
    this.loading = true;
    this.cacheService
      .getCached<Reviewer[]>(Constants.CACHE_KEYS.ALL_REVIEWERS)
      .pipe(
        switchMap((reviewers) =>
          // Check whether reviewers has been cachedd
          iif(
            () => Boolean(reviewers),
            of(reviewers as Reviewer[]), // Return the cached reviewers
            this.reviewerService.getAllReviewers() // Switch to fetch from server
          )
        )
      )
      .subscribe({
        next: (reviewers) => {
          this.reviewers = reviewers;
          this.collectionSize = reviewers.length;

          this.refreshTable(); // Re-render the table for the newly fetched reviewers
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  refreshTable() {
    // Calculate the items needed to be shown on the table
    this.showReviewers = this.reviewers.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
