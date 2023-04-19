import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, take} from 'rxjs/operators';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { iif, of } from 'rxjs';

import { RequestService } from '@/services/request.service';
import { Request } from '@/models/request';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-demands',
  templateUrl: './demands.component.html',
  styleUrls: ['./demands.component.scss']
})
export class DemandsComponent implements OnInit {

  faEye = faEye;
  requests: Request[] = [];
  showingRequests: Request[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  loading = false; // Whether loading for data

  constructor(private router: Router, private requestService: RequestService, private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loading = true;
    this.cacheService
      .getCached<Request[]>(Constants.CACHE_KEYS.ALL_REQUESTS)
      .pipe(
        take(1),
        switchMap((requests) =>
          iif(
            () => Boolean(requests),
            of(requests as Request[]),
            this.requestService.getAll()
          )
        )
      )
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.collectionSize = requests.length;
          this.refreshTable();
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  refreshTable() {
    this.showingRequests = this.requests.slice(
                          (this.page - 1) * this.pageSize,
                          (this.page - 1) * this.pageSize + this.pageSize
                        );
  }

  getTimeLeft(request: any) {
    const today = new Date();
    const createdAt = new Date(request.created_at.date);
    const diffTime: any = Math.abs(today.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return request.delay - diffDays + 1;
  }

  goToDetail(id: number) {
    this.router.navigate(['/admin/demands/' + id]);
  }

}
