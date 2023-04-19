export class Request {
  id: number;
  student_id: number;
  discipline_id: number;
  level_id: number;
  subject_id: number;
  course_number: string;
  discipline: any;
  level: any;
  subject: any;
  delay: number;
  exam_date: any;
  dismissed_at: any;
  paid: boolean;
  student: any;
  school: any;
  exams: any[]

  constructor(
    id: number,
    student_id: number,
    discipline_id: number,
    level_id: number,
    subject_id: number,
    course_number: string,
    discipline: any,
    level: any,
    subject: any,
    delay: number,
    exam_date: any,
    paid: boolean,
    student: any,
    school: any,
    exams: any[]
  ) {
    this.id = id;
    this.student_id = student_id;
    this.discipline_id = discipline_id;
    this.level_id = level_id;
    this.subject_id = subject_id;
    this.course_number = course_number;
    this.discipline = discipline;
    this.level = level;
    this.subject = subject;
    this.delay = delay;
    this.exam_date = exam_date;
    this.paid = paid;
    this.student = student;
    this.school = school;
    this.exams = exams;
  }
}