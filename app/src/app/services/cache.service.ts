import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private _data: Record<string, ReplaySubject<any>> = {};

  getCached<T>(key: string): Observable<T | undefined> {
    if (this._data[key]) {
      return this._data[key]!.asObservable();
    }

    return of(undefined);
  }

  cache<T>(key: string, data: T) {
    if (!this._data[key]) {
      this._data[key] = new ReplaySubject<T>(1);
    }

    this._data[key].next(data);
  }

  clear(key: string) {
    if (this._data[key]) {
      this._data[key].complete();
      delete this._data[key];
    }
  }

  clearAll() {
    for (const key in this._data) {
      this._data[key].complete();
      delete this._data[key];
    }
  }
}
