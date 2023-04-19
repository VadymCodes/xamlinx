import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, switchMap, take } from 'rxjs/operators';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { iif, of } from 'rxjs';

import { ConfirmModalService } from '@/components/confirm-modal/confirm-modal.service';
import { AdminService, GroupService } from '@/services/index';
import { Group } from '@/models/index';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  faEye = faEye;
  faTrash = faTrash;
  groups: Group[] = [];
  showingGroups: Group[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  error = '';
  loading = false; // Whether loading for data

  constructor(
    private router: Router,
    private adminService: AdminService,
    private groupService: GroupService,
    private confirmModalService: ConfirmModalService,
    private cacheService: CacheService,
  ) { }

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups() {
    this.loading = true;
    this.cacheService
      .getCached<Group[]>(Constants.CACHE_KEYS.ALL_GROUPS)
      .pipe(
        take(1),
        switchMap((groups) =>
          iif(
            () => Boolean(groups),
            of(groups as Group[]),
            this.adminService.getAllGroups()
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
    this.router.navigate(['/admin/group-list/' + id]);
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
}
