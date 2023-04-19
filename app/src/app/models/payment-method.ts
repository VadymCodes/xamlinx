export class PaymentMethod {
  id: number;
  type: string;
  payment_email: string;
  status: string;

  constructor(
    id: number,
    type: string,
    payment_email: string,
    status: string,
  ) {
    this.id = id;
    this.type = type;
    this.payment_email = payment_email;
    this.status = status;
  }
}