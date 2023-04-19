import { School } from "./school";

type Competencies = {
  id: number;
  user_id: number;
  disciplines: number[];
  levels: number[];
  subjects: number[];
};

export class Reviewer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  school_id: number;
  school: School;
  competencies: Competencies;
  temp_password: string;
  work_load: number;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    school_id: number,
    school: School,
    competencies: Competencies,
    temp_password: string,
    work_load: number,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.school_id = school_id;
    this.school = school;
    this.competencies = competencies;
    this.temp_password = temp_password;
    this.work_load = work_load;
  }
}
