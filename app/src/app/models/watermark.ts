interface Timestamp {
  date: string;
  timezone: string;
  timezone_type: number;
}

export class Watermark {
  id: number;
  public_id: string;
  status: string;
  created_at: Timestamp;
  deleted_at: Timestamp;
  updated_at: Timestamp;

  constructor(
    id: number,
    public_id: string,
    status: string,
    created_at: Timestamp,
    updated_at: Timestamp,
    deleted_at: Timestamp
  ) {
    this.id = id;
    this.public_id = public_id;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }
}
