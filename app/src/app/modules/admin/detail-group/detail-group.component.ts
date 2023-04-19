import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { finalize, first, switchMap } from 'rxjs/operators';

import { AdminService, ExamService, GroupService } from '@/services/index';
import { Constants } from '@/shared/constants';
import { ToastService } from '@/services/toast.service';
import { Group } from '@/models';
import { GroupMember } from '@/models/group';
import { ExamUpload } from '@/models/exam';
import { Discipline } from '@/models/discipline';
import { Level } from '@/models/level';
import { Subject } from '@/models/subject';

@Component({
  selector: 'app-detail-group',
  templateUrl: './detail-group.component.html',
  styleUrls: ['./detail-group.component.scss']
})
export class DetailGroupComponent implements OnInit {

  faFilePdf = faFilePdf;
  groupId: number;
  users: GroupMember[] = [];
  uploads: ExamUpload[] = [];
  disciplines: Discipline[] = [];
  levels: Level[] = [];
  subjects: Subject[] = [];
  examForm = this.formBuilder.group({
    groupName: '',
    summary: ['', Validators.required],
    disciplineId: [null, Validators.required],
    levelId: [null, Validators.required],
    subjectId: [null, Validators.required],
    profFirstName: ['', Validators.required],
    profLastName: ['', Validators.required],
    profWeb: ['', Validators.required],
    profEmail: ['', Validators.compose([Validators.required, Validators.email])],
  });
  submitted = false;
  loading = false;
  error = '';
  gmUploadFields = Constants.REQUIRED_FILE_UPLOADS.GROUP_MODE;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private examService: ExamService,
    private groupService: GroupService,
    private adminService: AdminService,
    private toastService: ToastService,
  ) {
    this.groupId = route.snapshot.params['id'];
    this.loading = true;
    this.groupService.getGroupById(this.groupId).pipe(first()).subscribe((res) => {
      this.setData(res);
      this.loading = false;
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

  setData(group: Group) {
    this.users = group.users!;
    this.uploads = group.exam.uploads!;

    this.f.groupName.setValue(group.name);
    this.f.summary.setValue(group.exam.summary);
    this.f.disciplineId.setValue(group.exam.discipline_id);
    this.f.levelId.setValue(group.exam.level_id);
    this.f.subjectId.setValue(group.exam.subject_id);
    this.f.profFirstName.setValue(group.exam.professor!.first_name);
    this.f.profLastName.setValue(group.exam.professor!.last_name);
    this.f.profWeb.setValue(group.exam.professor!.www_url);
    this.f.profEmail.setValue(group.exam.professor!.email);
  }

  get f() { return this.examForm.controls; }

  get studentsMeetFileUploadsRequirement() {
    let result = true;

    // Loop thourgh each students and check if they've uploaded all the required files defined in the constant
    this.users.forEach((student) => {
      for (const [key, value] of Object.entries(this.gmUploadFields.STUDENT)) {
        result = result && Boolean(student[value as 'date_proven' | 'identity_proven' | 'exam_proven']);
      }
    });

    return result;
  }

  handleFileInput(event: any, type: number) {

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

  getUpload(type: string) {
    const upload = this.uploads.find((upload: any) => upload.type === type);
    return upload? upload.cloud_url: null;
  }

  onSubmit() {
    this.loading = true;

    this.adminService.generatePDF(this.groupId)
      .pipe(
        first(),
        switchMap(() => this.groupService.getGroupById(this.groupId)),
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(
        (res) => {
          this.setData(res);

          this.toastService.show({
            content: 'Succesfully generated PDF document!',
            type: 'success'
          });
        },
        error => {
          this.error = error;
        });
  }

}
