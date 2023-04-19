import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { RequestService, AdminService } from '@/services/index';

@Component({
  selector: 'app-detail-demand',
  templateUrl: './detail-demand.component.html',
  styleUrls: ['./detail-demand.component.scss']
})
export class DetailDemandComponent implements OnInit {

  faEye = faEye;
  demandId: number;
  demand: any;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private adminService: AdminService
  ) {
    this.demandId = route.snapshot.params['id'];
    this.getDemand();
  }

  ngOnInit(): void {
  }

  getDemand() {
    this.adminService.getDemandById(this.demandId).pipe(first()).subscribe((res: any) => {
      this.demand = res.request;
    });
  }

  getTimeLeft(request: any) {
    const today = new Date();
    const createdAt = new Date(request.created_at.date);
    const diffTime: any = Math.abs(today.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return request.delay - diffDays + 1;
  }

  goToDetail(id: number) {
    this.router.navigate(['/admin/supplies/' + id]);
  }

  assignExam(id: number, payout: number) {
    const data = {
      id: id,
      payout: payout
    }
    this.loading = true;
    this.requestService.assignExam(data)
      .pipe(first())
      .subscribe((res: any) => {
        this.getDemand()
        this.loading = false;
        this.error = '';
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }

  findMatch() {
    this.loading = true;
    this.requestService.findMatch(this.demandId)
      .pipe(first())
      .subscribe((res: any) => {
        this.getDemand()
        this.loading = false;
        this.error = '';
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }
}
