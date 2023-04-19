export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export class Toast {
  content: string;
  header?: string;
  type?: ToastType;
  delay?: number;

  constructor(content: string, header?: string, type: ToastType = 'info', delay: number = 7000) {
    this.content = content;
    this.header = header;
    this.type = type;
    this.delay = delay;
  }
}
