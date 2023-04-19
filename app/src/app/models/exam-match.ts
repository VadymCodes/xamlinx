export class ExamMatch {
  id: number;
  request_id: number;
  exam_id: number;
  status: string;
  paid: number;
  exam: any;
  request: any;
  payments: any;
  payment_methods: any;

  constructor(
    id: number,
    request_id: number,
    exam_id: number,
    status: string,
    paid: number,
    exam: any,
    request: any,
    payments: any,
    payment_methods: any
  ) {
    this.id = id;
    this.request_id = request_id;
    this.exam_id = exam_id;
    this.status = status;
    this.paid = paid;
    this.exam = exam;
    this.request = request;
    this.payments = payments;
    this.payment_methods = payment_methods;
  }
}
