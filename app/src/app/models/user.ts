export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  suspended: boolean;
  can_upload: boolean;
  school: any;
  role: {
    id: number,
    name: string
  };
  token?: string;

  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    verified: boolean,
    suspended: boolean,
    can_upload: boolean,
    school: any,
    role: {
      id: number,
      name: string
    },
    token?: string,
  )
  {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.token = token;
    this.verified = verified;
    this.suspended = suspended;
    this.can_upload = can_upload;
    this.role = role;
    this.school = school;
  }
}
