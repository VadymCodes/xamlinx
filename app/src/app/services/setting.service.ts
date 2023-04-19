import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';
import { Setting } from '@/models/setting';
import { ModifiableConstant } from '@/models/modifiable-constant';
import { Watermark } from '@/models/watermark';

@Injectable({ providedIn: 'root' })
export class SettingService {
  private _url = environment.apiUrl;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getAll() {
    return this.http
      .get<Setting<any>[]>(`${this._url}/admin/settings`)
      .pipe(
        tap((settings) =>
          this.cacheService.cache(Constants.CACHE_KEYS.ADMIN_SETTINGS, settings)
        )
      );
  }

  getAvailablePaymentMethods() {
    return this.http
      .get<Setting<Record<string, boolean>>>(
        `${this._url}/settings/available-payment-methods`
      )
      .pipe(
        tap((methods) =>
          this.cacheService.cache(
            Constants.CACHE_KEYS.ALL_PAYMENT_METHODS,
            methods
          )
        )
      );
  }

  updatePaymentMethod(key: string, value: boolean) {
    return this.http
      .post<any>(`${this._url}/admin/settings`, {
        name: 'payment_methods',
        key: key,
        value: value,
      })
      .pipe(tap(() => this.clearCached()));
  }

  getEvents() {
    return this.http
      .get<any[]>(`${this._url}/admin/events`)
      .pipe(
        tap((events) =>
          this.cacheService.cache(Constants.CACHE_KEYS.ADMIN_EVENTS, events)
        )
      );
  }

  getModifiableConstants() {
    return this.http
      .get<ModifiableConstant[]>(`${this._url}/admin/constants`)
      .pipe(
        tap((constants) =>
          this.cacheService.cache(
            Constants.CACHE_KEYS.ADMIN_MODIFIABLE_EVENTS,
            constants
          )
        )
      );
  }

  updateModifiableConstant(constant: Record<string, any>) {
    return this.http.post(`${this._url}/admin/constants`, constant).pipe(
      tap(() => {
        this.clearCached();
      })
    );
  }

  getWatermarks() {
    return this.http
      .get<Watermark[]>(`${this._url}/admin/watermark/all`)
      .pipe(
        tap((watermarks) =>
          this.cacheService.cache(
            Constants.CACHE_KEYS.ADMIN_WATERMARKS,
            watermarks
          )
        )
      );
  }

  activeWatermark(id: number) {
    return this.http.post(`${this._url}/admin/watermark/set/${id}`, {}).pipe(
      tap(() => {
        this.clearCached();
      })
    );
  }

  uploadWatermark(formData: FormData) {
    return this.http
      .post(`${this._url}/admin/watermark/upload`, formData)
      .pipe(tap(() => this.clearCached()));
  }

  getWatermarkPreviewUrl(id: number) {
    return this.http.get<{waterMarkUrl: string}>(`${this._url}/admin/watermark/preview/${id}`);
  }

  removeInactiveWatermark(id: number) {
    return this.http.post(`${this._url}/admin/watermark/remove/${id}`, {}).pipe(
      tap(() => {
        this.clearCached();
      })
    );
  }

  clearCached() {
    this.cacheService.clear(Constants.CACHE_KEYS.ADMIN_SETTINGS);
    this.cacheService.clear(Constants.CACHE_KEYS.ALL_PAYMENT_METHODS);
    this.cacheService.clear(Constants.CACHE_KEYS.ADMIN_EVENTS);
    this.cacheService.clear(Constants.CACHE_KEYS.ADMIN_MODIFIABLE_EVENTS);
    this.cacheService.clear(Constants.CACHE_KEYS.ADMIN_WATERMARKS);
  }
}
