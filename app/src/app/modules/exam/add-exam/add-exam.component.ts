import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { ExamService } from '@/services/exam.service';
import { Constants } from '@/shared/constants';
import { urlValidator } from '@/shared/url.validator';
import { GroupService } from '@/services';
import { AuthenticationService } from '@/services/authentication.service';
import { examDateValidate } from '@/shared/date.validator';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss']
})
export class AddExamComponent implements OnInit {

  mode: string = 'single';
  single_mock_mode: string = 'handed';
  groupMessage = 'Create a new group or join existing group';
  isNewGroup = true;
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
  singleMaxIdle: number = 0;
  examForm = this.formBuilder.group({
    groupName: '',
    summary: ['', Validators.required],
    gradeValue: ['', Validators.compose([Validators.required, Validators.min(92), Validators.max(100)])],
    disciplineId: [null, Validators.required],
    levelId: [null, Validators.required],
    subjectId: [null, Validators.required],
    courseNum: [null, Validators.pattern('^(?![\\s\\S])|[-A-Za-z0-9 ]+')],
    examDate: [null, Validators.compose([Validators.required, examDateValidate(this.mode, this.singleMaxIdle)])],
    examNumber: null,
    duration: [null],
    semester: [null, Validators.required],
    profFirstName: ['', Validators.required],
    profLastName: ['', Validators.required],
    profWeb: ['', urlValidator()],
    profEmail: ['', Validators.compose([Validators.required, Validators.email])],
    ungradeActualFile: [null],
    gradeActualFile: [null],
    ungradeMockFile: [null],
    gradeMockFile: [null],
    dateProvenFile: [null],
    identityProvenFile: [null],
    examProvenFile: [null]
  });
  examNumbers = Constants.EXAM_NUMBERS;
  durations = Constants.EXAM_DURATIONS;
  semesters = Constants.SEMESTERS;
  submitted = false;
  loading = false;
  error = '';
  questions: any[] = [];
  single_questions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private examService: ExamService,
    private groupService: GroupService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.examService.getSingleModeMaxIdle().pipe(first()).subscribe(data => {
      this.singleMaxIdle = data['value'];
      this.examForm.controls['examDate'].setValidators(Validators.compose([Validators.required, examDateValidate(this.mode, this.singleMaxIdle)]));
      this.examForm.controls['examDate'].updateValueAndValidity();
    })
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

  onSearchGroup(groupName: string) {
    if (groupName) {
      this.examService.getGroupByName(groupName).subscribe((res: any) => {
        if (res.group) {
          this.f.groupName.setValue(res.group.name);
          this.isNewGroup = false;
          this.groupMessage = 'This group already exists. You may try to join this group';
          this.groupService.getGroupUsersByGroupId(res.group.id).subscribe((groupUsers: any) => {
            let currentUserId = this.authenticationService.currentUserValue?.id;
            groupUsers.groups.forEach((groupUser: any) => {
              if (currentUserId == groupUser.user.id) {
                this.groupMessage = 'You are already member of this group';
              }
            });
          });
        } else {
          this.isNewGroup = true;
          this.groupMessage = 'There is no such group. This group name is available.';
        }
      });
    } else {
      this.groupMessage = 'Create a new group or join existing group';
    }
  }

  addMoreQA() {
    if (this.mode !== 'single') {
      this.questions.push({
        id: null,
        question: '',
        solution: ''
      });
    } else {
      this.single_questions.push({
        id: null,
        question: '',
        solution: ''
      });
    }
  }

  selectMode(mode = 'single') {
    this.mode = mode;
    if (mode == 'group') {
      this.examForm.controls['groupName'].setValidators(Validators.required);
      this.examForm.controls['summary'].clearValidators();
      this.examForm.controls['disciplineId'].clearValidators();
      this.examForm.controls['levelId'].clearValidators();
      this.examForm.controls['subjectId'].clearValidators();
      this.examForm.controls['examDate'].setValidators(Validators.compose([Validators.required, examDateValidate(mode, this.singleMaxIdle)]));
      this.examForm.controls['semester'].clearValidators();
      this.examForm.controls['profFirstName'].clearValidators();
      this.examForm.controls['profLastName'].clearValidators();
      this.examForm.controls['profWeb'].clearValidators();
      this.examForm.controls['profEmail'].clearValidators();
      this.examForm.controls['gradeValue'].clearValidators();
    } else {
      this.examForm.controls['groupName'].clearValidators();
      this.examForm.controls['gradeValue'].setValidators(Validators.compose([Validators.required, Validators.min(92), Validators.max(100)]));
      this.examForm.controls['summary'].setValidators(Validators.required);
      this.examForm.controls['disciplineId'].setValidators(Validators.required);
      this.examForm.controls['levelId'].setValidators(Validators.required);
      this.examForm.controls['subjectId'].setValidators(Validators.required);
      this.examForm.controls['examDate'].setValidators(Validators.compose([Validators.required, examDateValidate(mode, this.singleMaxIdle)]));
      this.examForm.controls['semester'].setValidators(Validators.required);
      this.examForm.controls['profFirstName'].setValidators(Validators.required);
      this.examForm.controls['profLastName'].setValidators(Validators.required);
      this.examForm.controls['profWeb'].setValidators(urlValidator());
      this.examForm.controls['profEmail'].setValidators(Validators.compose([Validators.required, Validators.email]));
    }
    this.examForm.controls['groupName'].updateValueAndValidity();
    this.examForm.controls['gradeValue'].updateValueAndValidity();
    this.examForm.controls['summary'].updateValueAndValidity();
    this.examForm.controls['disciplineId'].updateValueAndValidity();
    this.examForm.controls['levelId'].updateValueAndValidity();
    this.examForm.controls['subjectId'].updateValueAndValidity();
    this.examForm.controls['examDate'].updateValueAndValidity();
    this.examForm.controls['semester'].updateValueAndValidity();
    this.examForm.controls['profFirstName'].updateValueAndValidity();
    this.examForm.controls['profLastName'].updateValueAndValidity();
    this.examForm.controls['profWeb'].updateValueAndValidity();
    this.examForm.controls['profEmail'].updateValueAndValidity();
  }

  selectSingleMockMode() {
    this.single_mock_mode = (this.single_mock_mode === 'handed' ? 'qaMode' : 'handed');
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.examForm.invalid) {
        return;
    }

    this.loading = true;
    const exam = {
      mode: this.mode,
      single_mock_mode: this.single_mock_mode,
      groupName: this.f.groupName.value,
      summary: this.f.summary.value,
      gradeValue: this.f.gradeValue.value,
      disciplineId: this.f.disciplineId.value,
      levelId: this.f.levelId.value,
      subjectId: this.f.subjectId.value,
      courseNum: this.f.courseNum.value,
      examDate: this.f.examDate.value,
      examNumber: this.f.examNumber.value,
      duration: this.f.duration.value,
      semester: this.f.semester.value,
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
      questions: (this.mode !== 'single' ? this.questions : this.single_questions)
    };
    this.examService.uploadExam(exam)
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(
        (data) => {
          if (data.message === 'Exam uploaded successfully') {
            this.router.navigate(['/exams/uploads']);
          } else {
            this.groupMessage = data.message;
          }
        },
        error => {
          this.error = error;
        });
  }

}
