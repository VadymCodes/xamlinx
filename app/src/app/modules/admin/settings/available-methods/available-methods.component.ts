import { Component, OnInit } from '@angular/core';
import { first, switchMap, take } from 'rxjs/operators';
import { iif, of } from 'rxjs';

import { SettingService } from '@/services';
import { CacheService } from '@/services/cache.service';
import { Constants } from '@/shared/constants';
import { Setting } from '@/models/setting';

@Component({
  selector: 'app-available-methods',
  templateUrl: './available-methods.component.html',
  styleUrls: ['./available-methods.component.scss']
})
export class AvailableMethodsComponent implements OnInit {
  paymentMethods: any; // Fetched payment methods
  submitted = false; // Whether updating the methods
  loading = false; // Whether loading for data

  constructor(
    private settingService: SettingService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    // Fetch payment methods from the cached or server
    this.loading = true;
    this.cacheService
      .getCached(Constants.CACHE_KEYS.ADMIN_SETTINGS)
      .pipe(
        take(1),
        switchMap((settings) =>
          // Check whether methods has been cached
          iif(
            () => Boolean(settings),
            of(settings as Setting<any>[]), // Return the cached methods
            this.settingService.getAll() // Switch to fetch from server
          )
        )
      )
      .subscribe({
        next: (res: Setting<any>[]) => {
          this.paymentMethods = this.getAttribute(res, 'payment_methods');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  getAttribute(settings: Setting<any>[], name: string) {
    const setting = settings.find((setting: any) => setting.name == name);
    if (setting) {
      return setting.value;
    }
    return null;
  }

  updatePaymentMethod(method: any, active: boolean) {
    this.submitted = true;
    this.settingService.updatePaymentMethod(method.key, active)
      .pipe(first())
      .subscribe((res: any) => {
        this.getPaymentMethods();
        this.submitted = false;
      });
  }
}
