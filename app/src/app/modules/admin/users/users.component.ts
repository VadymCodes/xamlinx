import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { iif, of } from 'rxjs';

import { UserService } from '@/services/user.service';
import { User } from '@/models/user';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  faEdit = faEdit;
  students: User[] = [];
  showingStudents: User[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  loading = false; // Whether loading for data

  constructor(private router: Router, private userService: UserService, private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loading = true;
    this.cacheService
      .getCached<User[]>(Constants.CACHE_KEYS.ALL_STUDENTS)
      .pipe(
        take(1),
        switchMap((students) =>
          iif(
            () => Boolean(students),
            of(students as User[]),
            this.userService.getStudents()
          )
        )
      )
      .subscribe({
        next: (students) => {
          this.students = students;
          this.collectionSize = students.length;
          this.refreshTable();
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  refreshTable() {
    this.showingStudents = this.students.slice(
                          (this.page - 1) * this.pageSize,
                          (this.page - 1) * this.pageSize + this.pageSize
                        );
  }

  goToDetail(id: number) {
    this.router.navigate(['/admin/users/' + id]);
  }

}
