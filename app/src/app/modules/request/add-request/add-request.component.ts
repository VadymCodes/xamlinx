import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { RequestService } from '@/services/request.service';
import { ExamService } from '@/services/exam.service';
import { Constants } from '@/shared/constants';

type Year = {
  name: string,
  value: number,
};

type Plan = 'mixed' | 'standard' | 'premium';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})

export class AddRequestComponent implements OnInit {

  disciplines:any[] = [];
  levels:any[] = [];
  subjects:any[] = [];
  requestForm = this.formBuilder.group({
    disciplineId: [null, Validators.required],
    levelId: [null, Validators.required],
    subjectId: [null, Validators.required],
    examDate: [null],
    duration: [null],
    courseNum: [null, Validators.pattern('^(?![\\s\\S])|[-A-Za-z0-9 ]+')],
    semester: [null],
    examNumber: null,
    delay: [null, Validators.required],
    plan: 'mixed',
    profFirstName: [''],
    profLastName: [''],
    profEmail: ['', Validators.email],
    otherSchool: [false],
    otherSemester: [false],
    otherProfessor: false,
    year: [null],
    yearCondition: ['exactly'],
  });
  examNumbers = Constants.EXAM_NUMBERS;
  durations = Constants.EXAM_DURATIONS;
  semesters = Constants.SEMESTERS;
  delays = Constants.EXAM_DELAYS;
  plans = Constants.EXAM_PLANS;
  submitted = false;
  loading = false;
  error = '';
  years: Year[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private examService: ExamService,
    private router: Router,
  ) {
    this.requestForm.controls['otherSchool'].valueChanges.subscribe(value => {
      if (value) {
        this.requestForm.controls['otherProfessor'].disable();
        this.f.otherProfessor.setValue(false);
      } else {
        this.requestForm.controls['otherProfessor'].enable();
      }
    });
  }

  ngOnInit(): void {
    let currentYear: number = new Date().getFullYear();
    for(let i = (currentYear - 4); i <= (currentYear); i++) {
        this.years.push({name:i.toString(), value: i});
    }

    this.examService.getAllDisciplines().pipe(first()).subscribe(disciplines => {
      this.disciplines = disciplines;
    });

    this.examService.getAllLevels().pipe(first()).subscribe(levels => {
      this.levels = levels;
    });

    this.examService.getAllSubjects().pipe(first()).subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  get f() { return this.requestForm.controls; }

  onSearchProf(email: string) {
    this.examService.getProfByEmail(email).subscribe((res: any) => {
      if (res.professor) {
        this.f.profFirstName.setValue(res.professor.first_name);
        this.f.profLastName.setValue(res.professor.last_name);
        this.requestForm.controls['profFirstName'].disable();
        this.requestForm.controls['profLastName'].disable();
      } else {
        this.f.profFirstName.setValue(null);
        this.f.profLastName.setValue(null);
        this.requestForm.controls['profFirstName'].enable();
        this.requestForm.controls['profLastName'].enable();
      }
    });
  }

  onPlanChange(plan: Plan) {
    this.requestForm.get('plan')?.setValue(plan);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.requestForm.invalid) {
        return;
    }

    this.loading = true;

    const request = {
      discipline_id: this.f.disciplineId.value,
      level_id: this.f.levelId.value,
      subject_id: this.f.subjectId.value,
      prof_first_name: this.f.profFirstName.value,
      prof_last_name: this.f.profLastName.value,
      prof_email: this.f.profEmail.value,
      exam_date: this.f.examDate.value,
      exam_number: this.f.examNumber.value,
      duration: this.f.duration.value,
      semester: this.f.semester.value,
      delay: this.f.delay.value,
      plan: this.f.plan.value,
      course_num: this.f.courseNum.value,
      other_school: this.f.otherSchool.value,
      other_semester: this.f.otherSemester.value,
      other_professor: this.f.otherProfessor.value,
      year: this.f.year.value,
      year_condition: this.f.yearCondition.value === 'exactly' ? undefined : this.f.yearCondition.value,
    };

    const emptyMatch = (request.course_num as string).match(/^(?![\s\S])/g);

    if (
      request.course_num.replace(/[\s-]/g, '') === '' ||
      (emptyMatch && emptyMatch[0] === '')
    ) {
      request.course_num = 'Not Specified';
    }

    this.requestService.create(request)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/requests']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}
