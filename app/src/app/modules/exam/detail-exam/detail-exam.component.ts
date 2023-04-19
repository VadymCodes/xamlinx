import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { isUndefined } from 'util';
import { first } from 'rxjs/operators';
import { Subscription  } from 'rxjs';

import { AuthenticationService, ExamService } from '@/services/index';
import { Constants } from '@/shared/constants';

@Component({
  selector: 'app-detail-exam',
  templateUrl: './detail-exam.component.html',
  styleUrls: ['./detail-exam.component.scss']
})
export class DetailExamComponent implements OnInit {

  mode = 'single';
  single_mock_mode: boolean = false;
  examId: number;
  groupId: number|null = null;
  users: any[] = [];
  disciplines:any[] = [];
  levels:any[] = [];
  subjects:any[] = [];
  ungradeActualFile: any;
  gradeActualFile: any;
  ungradeMockFile: any;
  gradeMockFile: any;
  dateProvenFile: any;
  identityProvenFile: any;
  examProvenFile: any;
  examForm = this.formBuilder.group({
    groupName: '',
    summary: ['', Validators.required],
    gradeValue: ['', Validators.compose([Validators.required, Validators.min(92), Validators.max(100)])],
    disciplineId: [null, Validators.required],
    levelId: [null, Validators.required],
    subjectId: [null, Validators.required],
    profFirstName: ['', Validators.required],
    profLastName: ['', Validators.required],
    profWeb: ['', Validators.required],
    profEmail: ['', Validators.compose([Validators.required, Validators.email])],
    ungradeActualFile: [null],
    gradeActualFile: [null],
    ungradeMockFile: [null],
    gradeMockFile: [null],
    ungradeActualUrl: [null],
    gradeActualUrl: [null],
    ungradeMockUrl: [null],
    gradeMockUrl: [null],
    dateProvenFile: [null],
    identityProvenFile: [null],
    examProvenFile: [null],
    dateProvenUrl: [null],
    identityProvenUrl: [null],
    examProvenUrl: [null]
  });
  submitted = false;
  loading = false;
  error = '';
  private subscription: Subscription = new Subscription();
  isGroupOwner = false;
  questions: any;
  examStatus: string = '';
  examStatusSystemDismissed = Constants.EXAM_STATUS.SYSTEM_DISMISSED;

  constructor(
    private formBuilder: FormBuilder,
    private examService: ExamService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.examId = route.snapshot.params['id'];
    this.examService.getExamById(this.examId).pipe(first()).subscribe((res: any) => {
      this.setExamData(res);
    });
  }

  ngOnInit(): void {
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

  setExamData(exam: any) {
    if (exam.group) {
      this.mode = 'group';
      this.groupId = exam.group_id;
      this.subscription = this.authService.currentUser.subscribe((user: any) => {
        if (user !== null && user.id == exam.group.owner_id) {
          this.isGroupOwner = true;
        }
      });
      this.f.groupName.setValue(exam.group.name);
      if (!this.isGroupOwner) {
        this.examForm.controls['groupName'].disable();
      }
      this.examForm.controls['groupName'].setValidators(Validators.required);
      this.examForm.controls['groupName'].updateValueAndValidity();
      this.examForm.controls['gradeValue'].clearValidators();
      this.examForm.controls['gradeValue'].updateValueAndValidity();

      this.users = exam.users;
    } else {
      this.single_mock_mode = exam.qa_mode;
      this.f.gradeValue.setValue(exam.grade_value);
      this.examForm.controls['gradeValue'].setValidators(Validators.compose([Validators.required, Validators.min(92), Validators.max(100)]));
      this.examForm.controls['gradeValue'].updateValueAndValidity();
    }
    this.examStatus = exam.status;
    this.f.summary.setValue(exam.summary);
    this.f.disciplineId.setValue(exam.discipline_id);
    this.f.levelId.setValue(exam.level_id);
    this.f.subjectId.setValue(exam.subject_id);
    this.f.profFirstName.setValue(exam.professor.first_name);
    this.f.profLastName.setValue(exam.professor.last_name);
    this.f.profWeb.setValue(exam.professor.www_url);
    this.f.profEmail.setValue(exam.professor.email);
    if (exam.uploads) {
      exam.uploads.forEach((upload: any) => {
        switch (upload.type) {
          case "u_act":
            this.f.ungradeActualUrl.setValue(upload.cloud_url);
            break;
          case "g_act":
            this.f.gradeActualUrl.setValue(upload.cloud_url);
            break;
          case "u_mock":
            this.f.ungradeMockUrl.setValue(upload.cloud_url);
            break;
          case "g_mock":
            this.f.gradeMockUrl.setValue(upload.cloud_url);
            break;
          default:
            break;
        }
      });
    }

    if (exam.group_files) {
      this.f.dateProvenUrl.setValue(exam.group_files.date_proven);
      this.f.identityProvenUrl.setValue(exam.group_files.identity_proven);
      this.f.examProvenUrl.setValue(exam.group_files.exam_proven);
    }

    this.questions = exam.qas;
  }

  get f() { return this.examForm.controls; }

  handleFileInput(event: any, type: number) {
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      switch (type) {
        case 0:
          this.ungradeActualFile = file;
          break;
        case 1:
          this.gradeActualFile = file;
          break;
        case 2:
          this.ungradeMockFile = file;
          break;
        case 3:
          this.gradeMockFile = file;
          break;
        case 4:
          this.dateProvenFile = file;
          break;
        case 5:
          this.identityProvenFile = file;
          break;
        case 6:
          this.examProvenFile = file;
          break;
        default:
          break;
      }
    }
  }

  addMoreQA() {
    this.questions.push({
      id: null,
      question: '',
      solution: ''
    });
  }

  onSearchProf(email: string) {
    this.examService.getProfByEmail(email).subscribe((res: any) => {
      if (res.professor) {
        this.f.profFirstName.setValue(res.professor.first_name);
        this.f.profLastName.setValue(res.professor.last_name);
        this.f.profWeb.setValue(res.professor.www_url);
        this.examForm.controls['profFirstName'].disable();
        this.examForm.controls['profLastName'].disable();
        this.examForm.controls['profWeb'].disable();
      } else {
        this.f.profFirstName.setValue(null);
        this.f.profLastName.setValue(null);
        this.f.profWeb.setValue(null);
        this.examForm.controls['profFirstName'].enable();
        this.examForm.controls['profLastName'].enable();
        this.examForm.controls['profWeb'].enable();
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.examForm.invalid) {
        return;
    }

    if(this.examStatus === this.examStatusSystemDismissed) {
      this.error = 'You are not allowed to update as your exam has been dismissed.';
      return;
    }

    this.loading = true;

    const exam = {
      mode: this.mode,
      single_mock_mode: this.single_mock_mode ? 'qaMode' : 'handed',
      groupId: this.groupId,
      summary: this.f.summary.value,
      gradeValue: this.f.gradeValue.value,
      disciplineId: this.f.disciplineId.value,
      levelId: this.f.levelId.value,
      subjectId: this.f.subjectId.value,
      profFirstName: this.f.profFirstName.value,
      profLastName: this.f.profLastName.value,
      profWeb: this.f.profWeb.value,
      profEmail: this.f.profEmail.value,
      ungradeActualFile: this.ungradeActualFile,
      gradeActualFile: this.gradeActualFile,
      ungradeMockFile: this.ungradeMockFile,
      gradeMockFile: this.gradeMockFile,
      dateProvenFile: this.dateProvenFile,
      identityProvenFile: this.identityProvenFile,
      examProvenFile: this.examProvenFile,
      questions: this.questions,
    };
    this.examService.uploadExam(exam, this.examId)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/exams/uploads']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
