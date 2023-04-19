import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { Exam } from '@/models/exam';
import { ExamService } from '@/services';

@Component({
  selector: 'app-exam-info',
  templateUrl: './exam-info.component.html',
  styleUrls: ['./exam-info.component.scss'],
})
export class ExamInfoComponent implements OnInit {
  private _examId: number = 0; // Exam ID from url param

  loading = false; // Loading state to determine when to render the page
  error = ''; // Response error message

  exam: Exam | undefined = undefined; // The selected exam

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this._examId = Number(param.id); // Get exam ID from url param

      this.loading = true;

      this.examService
        .getExamById(this._examId)
        .pipe(take(1))
        .subscribe(
          (exam) => {
            this.exam = exam;
          },
          (error) => {
            this.error = error.message;
          },
          () => {
            this.loading = false;
          }
        );
    });
  }
}
