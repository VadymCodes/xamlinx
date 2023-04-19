import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { iif, of, Subscription  } from 'rxjs';

import { AuthenticationService, ExamService } from '@/services/index';
import { Exam } from '@/models/exam';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {

  faEye = faEye;
  exams: Exam[] = [];
  showingExams: Exam[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  canUpload = false;
  loading = false; // Whether loading for data
  private subscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private examService: ExamService,
    private cacheService: CacheService,
  ) {
    this.subscription = this.authService.currentUser.subscribe((user: any) => {
      this.canUpload = user.can_upload;
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.cacheService
      .getCached<Exam[]>(Constants.CACHE_KEYS.USER_EXAMS)
      .pipe(
        take(1),
        switchMap((exams) =>
          iif(
            () => Boolean(exams),
            of(exams as Exam[]),
            this.examService.getMyUploads()
          )
        )
      )
      .subscribe({
        next: (exams) => {
          this.exams = exams;
          this.collectionSize = exams.length;
          this.refreshExams();
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  refreshExams() {
    this.showingExams = this.exams.slice(
                          (this.page - 1) * this.pageSize,
                          (this.page - 1) * this.pageSize + this.pageSize
                        );
  }

  goToNewExam() {
    this.router.navigate(['/exams/new']);
  }

  goToDetailExam(id: number) {
    this.router.navigate(['/exams/detail/' + id]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
        return 'badge-danger'
    }
  }
}
