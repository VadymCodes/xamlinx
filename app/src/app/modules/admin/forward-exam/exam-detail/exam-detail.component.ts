import { Component, Input, OnInit } from '@angular/core';

import { Exam } from '@/models';

@Component({
  selector: 'app-forward-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {
  @Input('exam') exam: Exam | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
