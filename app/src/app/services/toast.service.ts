import { Injectable } from "@angular/core";

import { Toast } from "@/models/toast";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = []; // Displaying toasts

  // Add a toast to the displaying toasts list
  show(toast: Toast) {
    this.toasts.push(toast);
  }

  // Remove a toast from the displaying list
  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
