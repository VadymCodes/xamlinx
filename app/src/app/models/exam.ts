import { Group, School, User } from '.';
import { Discipline } from './discipline';
import { GroupMember } from './group';
import { Level } from './level';
import { DateTime } from './date-time';
import { Subject } from './subject';

export interface Professor {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  www_url: string;
}

export interface QuestionsAndSolutions {
  id: number;
  exam: Exam;
  exam_id?: number;
  group_user_id?: number;
  is_final: boolean;
  question: string;
  solution: string;
}

export interface ExamUpload {
  id: number;
  cloud_url: string;
  exam_id: number;
  scan_status: string;
  type: string;
}

export type ExamUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'verified'
>;

export type ExamGroup = Pick<
  Group,
  'id' | 'name' | 'status' | 'owner_id' | 'quality' | 'rejected_at'
>;

export type GroupFiles = Pick<
  GroupMember,
  | 'id'
  | 'group_id'
  | 'user_id'
  | 'grade_value'
  | 'date_proven'
  | 'identity_proven'
  | 'exam_proven'
  | 'verified'
  | 'last_viewed_at'
>;

export class Exam {
  id: number;
  summary: string;
  grade_value: number;
  qa_mode: boolean;
  verified: boolean;
  discipline_id: number;
  level_id: number;
  subject_id: number;
  student_id: number;
  exam_date: DateTime;
  exam_number: number;
  course_number: string;
  semester: number;
  ungraded_sample_url: string;
  graded_sample_url: string;
  group_id: number;
  professor_id: number;
  school_id: number;
  plan: string;
  averageRating: number;
  status: string;
  discipline?: Discipline;
  level?: Level;
  subject?: Subject;
  professor?: Professor;
  student?: ExamUser;
  school?: School;
  group?: ExamGroup;
  group_files?: GroupFiles;
  qas?: QuestionsAndSolutions[];
  users?: GroupMember[];
  uploads?: ExamUpload[];

  constructor(
    id: number,
    summary: string,
    grade_value: number,
    qa_mode: boolean,
    verified: boolean,
    discipline_id: number,
    level_id: number,
    subject_id: number,
    student_id: number,
    exam_date: DateTime,
    exam_number: number,
    course_number: string,
    semester: number,
    ungraded_sample_url: string,
    graded_sample_url: string,
    group_id: number,
    professor_id: number,
    school_id: number,
    plan: string,
    averageRating: number,
    status: string,
    discipline?: Discipline,
    level?: Level,
    subject?: Subject,
    professor?: Professor,
    student?: ExamUser,
    school?: School,
    group?: ExamGroup,
    group_files?: GroupFiles,
    qas?: QuestionsAndSolutions[],
    users?: GroupMember[],
    uploads?: ExamUpload[]
  ) {
    this.id = id;
    this.summary = summary;
    this.grade_value = grade_value;
    this.qa_mode = qa_mode;
    this.verified = verified;
    this.discipline_id = discipline_id;
    this.level_id = level_id;
    this.subject_id = subject_id;
    this.student_id = student_id;
    this.exam_date = exam_date;
    this.exam_number = exam_number;
    this.course_number = course_number;
    this.semester = semester;
    this.ungraded_sample_url = ungraded_sample_url;
    this.graded_sample_url = graded_sample_url;
    this.group_id = group_id;
    this.professor_id = professor_id;
    this.school_id = school_id;
    this.plan = plan;
    this.averageRating = averageRating;
    this.status = status;
    this.discipline = discipline;
    this.level = level;
    this.subject = subject;
    this.professor = professor;
    this.student = student;
    this.school = school;
    this.group = group;
    this.group_files = group_files;
    this.qas = qas;
    this.users = users;
    this.uploads = uploads;
  }
}
