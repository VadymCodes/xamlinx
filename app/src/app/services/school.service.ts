import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { School } from '../models/school';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  constructor(private http: HttpClient) {}

  getByCountry(countryId: number) {
    return this.http.get<School[]>(
      `${environment.apiUrl}/schools?country_id=${countryId}`
    );
  }

  addAbbreviation(schoolId: number, abbreviation: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/admin/school/add-abbreviation/${schoolId}`,
      {
        abbreviation,
      }
    );
  }

  removeAbbreviation(schoolId: number, abbreviation: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/admin/school/remove-abbreviation/${schoolId}`,
      {
        abbreviation,
      }
    );
  }
}
