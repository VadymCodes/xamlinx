import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Discipline } from '@/models/discipline';
import { Level } from '@/models/level';
import { Reviewer } from '@/models/reviewer';
import { ExamService } from '@/services';
import { Subject } from '@/models/subject';

@Component({
  selector: 'app-forward-reviewer-detail',
  templateUrl: './reviewer-detail.component.html',
  styleUrls: ['./reviewer-detail.component.scss'],
})
export class ReviewerDetailComponent implements OnInit {
  @Input('reviewer') reviewer: Reviewer | undefined;

  private _disciplines: Discipline[] = []; // Fetched disciplines
  private _levels: Level[] = []; // Fetched levels
  private _subjects: Subject[] = []; // Fetched subjects

  loading = true; // Whether fetching information

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    // Get all disciplines, levels, subjects
    combineLatest([
      this.examService.getAllDisciplines(),
      this.examService.getAllLevels(),
      this.examService.getAllSubjects(),
    ])
      .pipe(
        take(1),
        map(([disciplines, levels, subjects]) => ({
          disciplines,
          levels,
          subjects,
        }))
      )
      .subscribe(({ disciplines, levels, subjects }) => {
        this._disciplines = disciplines;
        this._levels = levels;
        this._subjects = subjects;

        this.loading = false;
      });
  }

  /**
   * Getter to get a string of concatenated array of reviewer discipline ID
   */
  get disciplines() {
    return (
      this.reviewer?.competencies.disciplines.map(
        (disciplineId) =>
          // Find the discipline with this ID
          this._disciplines.find((d) => d.id === disciplineId)?.name
      ) || ''
    );
  }

  /**
   * Getter to get a string of concatenated array of reviewer level ID
   */
  get levels() {
    return (
      this.reviewer?.competencies.levels.map(
        (levelId) =>
          // Find the discipline with this ID
          this._levels.find((l) => l.id === levelId)?.name
      ) || ''
    );
  }

  /**
   * Getter to get a string of concatenated array of reviewer subject ID
   */
  get subjects() {
    return (
      this.reviewer?.competencies.subjects.map(
        (subjectId) =>
          // Find the discipline with this ID
          this._subjects.find((s) => s.id === subjectId)?.name
      ) || ''
    );
  }
}
