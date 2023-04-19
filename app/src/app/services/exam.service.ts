import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Exam } from '../models/index';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';
import { Discipline } from '@/models/discipline';
import { Level } from '@/models/level';
import { Subject } from '@/models/subject';

const endpoint = `${environment.apiUrl}/exams`;

@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getAll() {
    return this.http
      .get<Exam[]>(`${endpoint}`)
      .pipe(
        tap((exams) =>
          this.cacheService.cache<Exam[]>(Constants.CACHE_KEYS.ALL_EXAMS, exams)
        )
      );
  }

  getMyUploads() {
    return this.http
      .get<Exam[]>(`${endpoint}/get-by-user`)
      .pipe(
        tap((exams) =>
          this.cacheService.cache<Exam[]>(
            Constants.CACHE_KEYS.USER_EXAMS,
            exams
          )
        )
      );
  }

  getExamById(id: number) {
    return this.http
      .get<{ exam: Exam }>(`${endpoint}/${id}`)
      .pipe(map((result) => result.exam));
  }

  getSingleModeMaxIdle() {
    return this.http.get<any>(`${endpoint}/get-singleMaxIdle`);
  }

  getAllDisciplines() {
    return this.http.get<Discipline[]>(`${endpoint}/get-disciplines`);
  }

  getAllLevels() {
    return this.http.get<Level[]>(`${endpoint}/get-levels`);
  }

  getAllSubjects() {
    return this.http.get<Subject[]>(`${endpoint}/get-subjects`);
  }

  getProfByEmail(email: string) {
    return this.http.get<any[]>(`${endpoint}/get-professor/${email}`);
  }

  getGroupByName(name: string) {
    return this.http.get<any[]>(`${endpoint}/get-group/${name}`);
  }

  uploadExam(exam: any, id: number|null = null) {
    let formData:FormData = new FormData();

    formData.append('mode', exam.mode);
    formData.append('single_mock_mode', exam.single_mock_mode);
    formData.append('group_name', exam.groupName);
    formData.append('group_id', exam.groupId);
    formData.append('summary', exam.summary);
    formData.append('grade_value', exam.gradeValue);
    formData.append('discipline_id', exam.disciplineId);
    formData.append('subject_id', exam.subjectId);
    formData.append('level_id', exam.levelId);
    formData.append('course_number', exam.courseNum);
    formData.append('exam_date', exam.examDate);
    formData.append('exam_number', exam.examNumber);
    formData.append('duration', exam.duration);
    formData.append('semester', exam.semester);
    formData.append('prof_first_name', exam.profFirstName);
    formData.append('prof_last_name', exam.profLastName);
    formData.append('prof_web', exam.profWeb);
    formData.append('prof_email', exam.profEmail);
    formData.append('questions_and_solutions', JSON.stringify(exam.questions));

    if (exam.ungradeActualFile) {
      formData.append('ungraded_actual', exam.ungradeActualFile, exam.ungradeActualFile.name);
    }

    if (exam.gradeActualFile) {
      formData.append('graded_actual', exam.gradeActualFile, exam.gradeActualFile.name);
    }

    if (exam.ungradeMockFile) {
      formData.append('ungraded_mock', exam.ungradeMockFile, exam.ungradeMockFile.name);
    }

    if (exam.gradeMockFile) {
      formData.append('graded_mock', exam.gradeMockFile, exam.gradeMockFile.name);
    }

    if (exam.dateProvenFile) {
      formData.append('date_proven', exam.dateProvenFile, exam.dateProvenFile.name);
    }

    if (exam.identityProvenFile) {
      formData.append('identity_proven', exam.identityProvenFile, exam.identityProvenFile.name);
    }

    if (exam.examProvenFile) {
      formData.append('exam_proven', exam.examProvenFile, exam.examProvenFile.name);
    }

    let observable: Observable<any>;

    if (id === null) {
      // Create new exam
      observable = this.http.post<any>(`${endpoint}/create`, formData);
    } else {
      // Update an existing exam
      observable = this.http.post<any>(`${endpoint}/update/${id}`, formData);
    }

    observable.pipe(tap(() => this.clearCached()));

    return observable;
  }

  clearCached() {
    this.cacheService.clear(Constants.CACHE_KEYS.ALL_EXAMS);
    this.cacheService.clear(Constants.CACHE_KEYS.USER_EXAMS);
  }
}
