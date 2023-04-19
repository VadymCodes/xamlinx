import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { faEye, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { iif, of } from 'rxjs';

import { ExamService } from '@/services/exam.service';
import { Exam } from '@/models/exam';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styleUrls: ['./supplies.component.scss'],
})
export class SuppliesComponent implements OnInit {
  // View icons for the action button
  faEye = faEye;
  faUserEdit = faUserEdit;

  loading = false; // Whether loading for data

  exams: Exam[] = []; // Fetched exams
  showItems: Exam[] = []; // The list of exams being shown on the table

  // Table props
  page = 1; // The current page
  pageSize = 5; // The current page size
  collectionSize = 0; // The amount of items on the table

  constructor(
    private router: Router,
    private examService: ExamService,
    private cacheService: CacheService
  ) {}

  get examStatusActive() {
    return Constants.EXAM_STATUS.ACTIVE;
  }

  ngOnInit(): void {
    // Fetch exams from cached or server
    this.loading = true;
    this.cacheService
      .getCached<Exam[]>(Constants.CACHE_KEYS.ALL_EXAMS)
      .pipe(
        take(1),
        switchMap((exams) =>
          // Check whether exams has been cachedd
          iif(
            () => Boolean(exams),
            of(exams as Exam[]), // Return the cached exams
            this.examService.getAll() // Switch to fetch from server
          )
        )
      )
      .subscribe({
        next: (exams) => {
          this.exams = exams;
          this.collectionSize = exams.length;

          this.refreshTable(); // Re-render the table for the newly fetched exams
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  refreshTable() {
    // Calculate the items needed to be shown on the table
    this.showItems = this.exams.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  goToDetail(id: number) {
    this.router.navigate(['/admin/supplies/' + id]);
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
