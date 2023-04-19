import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { ExamService, AdminService } from '@/services/index';
import { Exam } from '@/models/index';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-detail-supply',
  templateUrl: './detail-supply.component.html',
  styleUrls: ['./detail-supply.component.scss']
})
export class DetailSupplyComponent implements OnInit {

  faFilePdf = faFilePdf;
  examId: number;
  exam: Exam = {} as Exam;
  loading = false;
  error = '';
  examStatusSystemDismissed = Constants.EXAM_STATUS.SYSTEM_DISMISSED;
  smUploadFields: Record<string, string> = {};

  constructor(
    private examService: ExamService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.examId = route.snapshot.params['id'];
    this.getSupply();
  }

  ngOnInit(): void {
  }

  get requiredNumOfUploads() {
    return Object.keys(this.smUploadFields).length;
  }

  getSupply() {
    this.adminService.getExamById(this.examId).pipe(first()).subscribe((exam) => {
      this.exam = exam;
      this.smUploadFields = exam.qa_mode ? Constants.REQUIRED_FILE_UPLOADS.SINGLE_MODE.QA_MODE_TRUE : Constants.REQUIRED_FILE_UPLOADS.SINGLE_MODE.QA_MODE_FALSE;
      console.log(this.smUploadFields);
    });
  }

  getSemester(value: number): any {
    const semesters = Constants.SEMESTERS;
    return semesters.find(s => s.value === value);
  }

  getUpload(type: string) {
    const upload = this.exam.uploads!.find((upload) => upload.type === type);
    if (upload) {
      let msg = 'File in pending scan';
      switch (upload.scan_status) {
        case "approved":
          msg = 'File is approved';
          break;
        case "rejected":
          msg = 'File is rejected';
          break;
        default:
          msg = 'File in pending scan';
          break;
      }
      return {
        url: upload.cloud_url,
        msg: msg
      };
    } else {
      return {
        msg: 'There is no uploaded file'
      };
    }
  }

  markAsVerified() {

    if(this.exam.status === this.examStatusSystemDismissed) {
      this.error = 'You are not allowed to verify as this exam has been dismissed.';
      return;
    }

    this.loading = true;

    this.adminService.markAsVerifiedExam(this.examId)
      .pipe(first())
      .subscribe(
        data => {
          this.getSupply();
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  askToUpload(examId: number) {

    if(this.exam.status === this.examStatusSystemDismissed) {
      this.error = 'You are not allowed to upload as this exam has been dismissed.';
      return;
    }

    this.adminService.askToUpload(examId)
      .pipe(first())
      .subscribe(
        data => {
          this.getSupply();
        },
        error => {
          this.error = error;
        });
  }

}
