import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, switchMap, take } from 'rxjs/operators';
import { faEye, faTrash, faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import { iif, of, Subscription  } from 'rxjs';

import { ConfirmModalService } from '@/components/confirm-modal/confirm-modal.service';
import { AuthenticationService, ExamService, GroupService } from '@/services/index';
import { Group } from '@/models/index';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  private subscription: Subscription;

  // Icons
  faEye = faEye;
  faTrash = faTrash;
  faPencilRuler = faPencilRuler;

  groups: Group[] = [];
  showingGroups: Group[] = [];

  // Table props
  page = 1;
  pageSize = 5;
  collectionSize = 0;

  canUpload = false;
  authUserId = null;

  loading = false; // Whether loading for data
  error = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private examService: ExamService,
    private groupService: GroupService,
    private confirmModalService: ConfirmModalService,
    private cacheService: CacheService,
  ) {
    this.subscription = this.authService.currentUser.subscribe((user: any) => {
      this.canUpload = user.can_upload;
      this.authUserId = user.id;
    });
  }

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups() {
    this.loading = true;
    this.cacheService
      .getCached<Group[]>(Constants.CACHE_KEYS.USER_GROUPS)
      .pipe(
        take(1),
        switchMap((groups) =>
          iif(
            () => Boolean(groups),
            of(groups as Group[]),
            this.groupService.getAll()
          )
        )
      )
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.collectionSize = groups.length;
          this.refreshExams();
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  refreshExams() {
    this.showingGroups = this.groups.slice(
                          (this.page - 1) * this.pageSize,
                          (this.page - 1) * this.pageSize + this.pageSize
                        );
  }

  goToDetailGroup(id: number) {
    this.router.navigate(['/exams/detail/' + id]);
  }

  delete(id: number) {
    this.confirmModalService.confirm('Please confirm..', 'Do you really want to delete?')
      .then((confirmed) => {
        if (confirmed) {
          this.groupService.delete(id)
            .pipe(first())
            .subscribe(
              data => {
                this.getGroups();
              },
              error => {
                this.error = error;
              });
        }
      });
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
      case Constants.GROUP_STATUS.ACTIVE:
        return 'badge-success';
      case (Constants.GROUP_STATUS.IN_PROGRESS || Constants.GROUP_STATUS.PENDING_ADMIN_REVIEW):
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  }

  /**
   * Questions nav button click event handler.
   * Show a dialog to confirm user action to view the group questions in timeline
   * @param id The selected group's id
   */
  onQuestionsClick(id: number) {
    this.confirmModalService
      .confirm(
        "View group's timeline",
        "Do you want to view the group's questions timeline? You can only view it once every 24 hours!",
        'View',
        'Cancel',
        'lg'
      )
      .then((result) => {
        if (result) {
          this.router.navigate(['groups', 'questions', id]);
        }
      })
      .catch(() => {});
  }
}
