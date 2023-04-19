import { Exam, User } from '.';
import { DateTime } from './date-time';
import { School } from './school';

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  grade_value: number;
  date_proven: string;
  identity_proven: string;
  exam_proven: string;
  verified: boolean;
  last_viewed_at: DateTime;
  user: User;
  school: School;
}

export interface GroupQuestion {
  group_user: GroupMember;
  id: number;
  is_final: boolean;
  question: string;
  solution: string;
}

export class Group {
  id: number;
  name: string;
  status: string;
  owner_id: number;
  quality: string;
  rejected_at: string;
  exam: Exam;
  users?: GroupMember[];
  memberCount?: number;
  owner?: User;

  constructor(
    id: number,
    name: string,
    status: string,
    owner_id: number,
    quality: string,
    rejected_at: string,
    exam: Exam,
    users?: GroupMember[],
    memberCount?: number,
    owner?: User
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.owner_id = owner_id;
    this.quality = quality;
    this.rejected_at = rejected_at;
    this.exam = exam;
    this.users = users;
    this.memberCount = memberCount;
    this.owner = owner;
  }
}
