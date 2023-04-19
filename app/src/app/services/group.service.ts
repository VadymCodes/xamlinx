import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Group } from '../models/index';
import { CacheService } from './cache.service';
import { Constants } from '@/shared/constants';
import { GroupMember, GroupQuestion } from '@/models/group';

const endpoint = `${environment.apiUrl}/groups`;

@Injectable({ providedIn: 'root' })
export class GroupService {
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getAll() {
    return this.http
      .get<Group[]>(`${endpoint}`)
      .pipe(
        tap((groups) =>
          this.cacheService.cache<Group[]>(
            Constants.CACHE_KEYS.USER_GROUPS,
            groups
          )
        )
      );
  }

  getGroupById(id: number) {
    return this.http.get<{group: Group}>(`${endpoint}/${id}`).pipe(map((res) => res.group));
  }

  getGroupUsersByGroupId(id: Number) {
    return this.http
      .post<{ group_users: GroupMember[] }>(`${endpoint}/get-group-users/${id}`, {})
      .pipe(map((result) => result.group_users));
  }

  delete(id: number) {
    return this.http.delete<Group[]>(`${endpoint}/${id}`).pipe(
      tap(() => this.clearCached())
    );
  }

  getGroupQuestions(id: number) {
    return this.http
      .get<{ qas: GroupQuestion[] }>(`${endpoint}/group-qas/${id}`)
      .pipe(map((result) => result.qas));
  }

  previewCompose(id: number) {
    return this.http.get<{ status: boolean }>(`${endpoint}/${id}/preview-compose`);
  }

  clearCached() {
    this.cacheService.clear(Constants.CACHE_KEYS.ALL_GROUPS);
    this.cacheService.clear(Constants.CACHE_KEYS.USER_GROUPS);
  }
}
