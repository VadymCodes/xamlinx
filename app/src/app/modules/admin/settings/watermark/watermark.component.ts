import { Watermark } from '@/models/watermark';
import { SettingService } from '@/services';
import { ToastService } from '@/services/toast.service';
import { Constants } from '@/shared/constants';
import { Component, OnInit } from '@angular/core';
import { finalize, map, switchMap } from 'rxjs/operators';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-watermark',
  templateUrl: './watermark.component.html',
  styleUrls: ['./watermark.component.scss'],
})
export class WatermarkComponent implements OnInit {
  watermarks: any[] = [];
  submitting = false; // Whether the request is being sent
  gettingPreviewUrl: boolean[] = []; // Whether the request for preview url is being sent
  faEye = faEye;

  // Table props
  page = 1;
  pageSize = 5;
  collectionSize = 0;

  loading = false; // Whether loading data for the first time

  constructor(
    private settingService: SettingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get watermarks from the server
    this.loading = true;
    this.settingService.getWatermarks().subscribe({
      next: (watermarks) => {
        this.watermarks = Array.isArray(watermarks) ? watermarks : [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  get WATERMARK_STATUS_ACTIVE() {
    return Constants.WATERMARK_STATUS.ACTIVE;
  }

  get WATERMARK_STATUS_INACTIVE() {
    return Constants.WATERMARK_STATUS.INACTIVE;
  }

  /**
   * Get Bootstrap's badge class according to watermark status
   * @param watermark
   */
  getStatusBadgeStyle(watermark: Watermark) {
    switch (watermark.status) {
      case Constants.WATERMARK_STATUS.ACTIVE:
        return 'badge-success';

      default:
        return 'badge-danger';
    }
  }

  /**
   * 'Upload new exam' button click event handler
   * Call the hidden type file input
   */
  onStartUpload(inputRef: HTMLInputElement) {
    inputRef.click();
  }

  /**
   * Hidden type file input event handler
   * Upload selected file to the server
   */
  onUpload(inputRef: HTMLInputElement) {
    const file = inputRef.files?.item(0);

    if (file) {
      const formData = new FormData();

      formData.append('waterMark', file);

      this.submitting = true;
      this.settingService
        .uploadWatermark(formData)
        .pipe(
          switchMap(() => this.settingService.getWatermarks()), // Re-fetch watermarks after uploaded
          finalize(() => {
            this.submitting = false;
          })
        )
        .subscribe(
          (watermarks) => {
            this._setupWatermarks(watermarks);
            this.toastService.show({
              content: 'Successfully uploaded new watermark',
              type: 'success',
            });
          },
          () => {
            this.toastService.show({
              content: 'There was an error while uploading watermark',
              type: 'danger',
            });
          }
        );
    }
  }

  private _setupWatermarks(watermarks: Watermark[]) {
    this.gettingPreviewUrl = [];
    this.watermarks = watermarks;
    watermarks.forEach(() => {
      this.gettingPreviewUrl.push(false);
    });
  }

  /**
   * "Set as Active" button click event handler
   * Send the request to the server to set water as active
   */
  onSetAsActive(watermark: Watermark) {
    this.submitting = true;
    this.settingService
      .activeWatermark(watermark.id)
      .pipe(
        switchMap(() => this.settingService.getWatermarks()), // Re-fetch watermarks after request
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (watermarks) => {
          this._setupWatermarks(watermarks);
          this.toastService.show({
            content: 'Successfully set watermark as active',
            type: 'success',
          });
        },
        error: () => {
          this.toastService.show({
            content: 'There was an error while setting watermark as active',
            type: 'danger',
          });
        },
      });
  }

  /**
   * "Delete" button click event handler
   * Send the request to the server to delete inactive watermark
   */
  onDelete(watermark: Watermark) {
    this.submitting = true;
    this.settingService
      .removeInactiveWatermark(watermark.id)
      .pipe(
        switchMap(() => this.settingService.getWatermarks()), // Re-fetch watermarks after request
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (watermarks) => {
          this._setupWatermarks(watermarks);
          this.toastService.show({
            content: 'Successfully delete watermark',
            type: 'success',
          });
        },
        error: () => {
          this.toastService.show({
            content: 'There was an error while deleting watermark',
            type: 'danger',
          });
        },
      });
  }

  /**
   * "Click to view" button click event handler
   * Send the request to the server to get the url and then open new tab for it
   */
  onView(watermark: Watermark, index: number) {
    this.gettingPreviewUrl[index] = true;
    this.settingService
      .getWatermarkPreviewUrl(watermark.id)
      .pipe(
        map(result => result.waterMarkUrl),
        finalize(() => {
          this.gettingPreviewUrl[index] = false;
        })
      )
      .subscribe({
        next: (url: any) => {
          window.open(url, '_blank')!.focus();
        },
        error: () => {
          this.toastService.show({
            content: 'There was an error while getting preview url',
            type: 'danger',
          });
        },
      });
  }
}
