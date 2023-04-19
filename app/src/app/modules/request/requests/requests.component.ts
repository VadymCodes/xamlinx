import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, switchMap, take } from 'rxjs/operators';
import { faEye, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { iif, of, Subscription  } from 'rxjs';

import { AuthenticationService, RequestService } from '@/services/index';
import { Request } from '@/models/request';
import { ConfirmModalService } from '@/components/confirm-modal/confirm-modal.service';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  faEye = faEye;
  faTrash = faTrash;
  faTimes = faTimes;
  requests: Request[] = [];
  showingRequests: Request[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  canRequest = false;
  loading = false; // Whether loading for data
  private subscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private requestService: RequestService,
    private confirmModalService: ConfirmModalService,
    private cacheService: CacheService,
  ) {
    this.subscription = this.authService.currentUser.subscribe((user: any) => {
      this.canRequest = user.verified;
    });
  }

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests() {
    this.loading = true;
    this.cacheService
      .getCached<Request[]>(Constants.CACHE_KEYS.USER_REQUESTS)
      .pipe(
        take(1),
        switchMap((requests) =>
          iif(
            () => Boolean(requests),
            of(requests as Request[]),
            this.requestService.getByUser()
          )
        )
      )
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.collectionSize = requests.length;
          this.refreshRequests();
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  refreshRequests() {
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

  goToNewRequest() {
    this.router.navigate(['/requests/new']);
  }

  goToDetailRequest(id: number) {
    this.router.navigate(['/requests/detail/' + id]);
  }

  dismiss(requestId: number) {
    this.confirmModalService.confirm('Please confirm..', 'Do you really want to dismiss?')
      .then((confirmed) => {
        if (confirmed) {
          this.requestService.dismiss(requestId)
            .pipe(first())
            .subscribe(
              data => {
                this.getRequests();
              },
              error => {
              });
        }
      });
  }

  delete(requestId: number) {
    this.confirmModalService.confirm('Please confirm..', 'Do you really want to delete?')
      .then((confirmed) => {
        if(confirmed) {
          this.requestService.delete(requestId)
            .pipe(first())
            .subscribe(
              data => {
                this.getRequests();
              },
              error => {
              });
          }
      });
  }

}
