import { Toast } from '@/models/toast';
import { ToastService } from '@/services/toast.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent implements OnInit {
  constructor(private toastService: ToastService) {}

  ngOnInit(): void {}

  /** Getter to get all the displaying toasts */
  get toasts() {
    return this.toastService.toasts;
  }

  /**
   * Get the Bootstrap's background color classes according to the type of the toast
   * @param toast The displaying toast
   * @returns Bootstrap's background color classes
   */
  getTypeClass(toast: Toast) {
    switch (toast.type) {
      case 'danger':
        return 'bg-danger text-light';
      case 'success':
        return 'bg-success text-light';
      case 'warning':
        return 'bg-warning';
      default:
        return '';
    }
  }

  /**
   * Remove event handler when the toast is expired.
   * @param toast The expired toast
   */
  onRemove(toast: Toast) {
    this.toastService.remove(toast);
  }
}
