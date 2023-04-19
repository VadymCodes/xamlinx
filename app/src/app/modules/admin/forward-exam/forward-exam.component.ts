import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { iif, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

import { Constants } from '@/shared/constants';
import { Exam } from '@/models';
import { Reviewer } from '@/models/reviewer';
import { ExamService } from '@/services';
import { CacheService } from '@/services/cache.service';
import { ReviewerService } from '@/services/reviewer.service';

@Component({
  selector: 'app-forward-exam',
  templateUrl: './forward-exam.component.html',
  styleUrls: ['./forward-exam.component.scss'],
})
export class ForwardExamComponent implements OnInit {
  private _reviewers: Reviewer[] = []; // Fetched reviewers that has the same discipline, level and subject to the selected exam with active status

  faEye = faEye; // Reviewer view detail icon

  loading = true; // Loading state to determine when to render the page
  submitting = false; // Loading state when submitting the request

  exams: Exam[] = []; // Fetched exams with active status
  selectedDetailReviewer: Reviewer | undefined = undefined; // The selected reviewer to display information

  error: string = ''; // Error message when response return with error

  // Form
  form = this.fb.group({
    exam: this.fb.control(undefined, Validators.required),
    reviewers: this.fb.array(
      [this.fb.control(undefined, Validators.required)],
      Validators.required
    ),
  });

  constructor(
    private fb: FormBuilder,
    private cacheService: CacheService,
    private examService: ExamService,
    private reviewerService: ReviewerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cacheService.getCached<Exam[]>(Constants.CACHE_KEYS.ALL_EXAMS).pipe(
      take(1),
      switchMap((exams) =>
        // Check whether exams has been cachedd
        iif(
          () => Boolean(exams),
          of(exams as Exam[]), // Return the cached exams
          this.examService.getAll() // Switch to fetch from server
        )
      ),
      map((exams) =>
      // Filter exam with active status and has question and solutions provided
      exams.filter((e) => e.status === Constants.EXAM_STATUS.ACTIVE && e.qa_mode)
      )
    ).subscribe((exams) => {
      this.exams = exams;
      this.loading = false; // Unlock to render the page

      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        // Check query params to have the exam ID field
        if (params.exam) {
          // Select the exam with the ID from the query params
          this.formExamControl.setValue(Number(params.exam));

          // Filter reviewers to match the exam
          this.onSelectExam();
        }
      });
    });
  }

  /**
   * Get filtered reviewers to prevent duplication for selected reviewers
   * @returns An array of reviewers
   */
  get reviewers() {
    return this._reviewers.filter(
      (reviewer) =>
        !Boolean(
          (this.formReviewersControl.value as Reviewer[]).find(
            (r) => r && r.id === reviewer.id
          )
        )
    );
  }

  /**
   * Getter for form reviewers form array
   */
  get formReviewersControl() {
    return this.form.get('reviewers') as FormArray;
  }

  /**
   * Getter for form exam form control
   */
  get formExamControl() {
    return this.form.get('exam') as FormControl;
  }

  /**
   * Getter for selected exam
   */
  get selectedExam() {
    return this.exams.find((exam) => exam.id === this.formExamControl.value);
  }

  /**
   * Sending request reviewer API
   */
  private _onSubmit() {
    const examId = this.formExamControl.value;
    const reviewerIds = (this.formReviewersControl.value as Reviewer[])
      .filter((reviewer) => reviewer !== null)
      .map((reviewer) => reviewer.id);

    this.submitting = true; // Set the state to lock the submit button

    this.reviewerService.requestReview(examId, reviewerIds).subscribe(
      () => {
        this.router.navigate(['/admin', 'supplies']);
        return;
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
        this.submitting = false;
      }
    );
  }

  /**
   * Exam select event handler.
   * Fetch reviewers that has the same discipline, level and subject to the selected exam
   */
  onSelectExam() {
    // Check if the user select an exam or clear exam
    if (this.selectedExam) {
      const { discipline, level, subject } = this.selectedExam;

      this.reviewerService
        .getReviewerByCompetency({
          discipline_id: discipline!.id,
          level_id: level!.id,
          subject_id: subject!.id,
        })
        .subscribe((reviewers) => {
          this._reviewers = reviewers;
        });
    } else {
      // Clear everything if the user clear the exam input
      this.formReviewersControl.clear();
      this.formReviewersControl.push(
        this.fb.control(undefined, Validators.required)
      );
      this._reviewers = [];
      this.selectedDetailReviewer = undefined;
    }
  }

  /**
   * Reviewer select event handler.
   * Add a new form control to the reviewers form array when selected a reviewer
   * @param index The index of the selected reviewer
   */
  onSelectReviewer(index: number) {
    const selectedReviewer: Reviewer | null =
      this.formReviewersControl.at(index).value; // The selected reviewer

    // Check if the user select a reviewer or clear one
    if (selectedReviewer) {
      // Push new form control to the form array
      this.formReviewersControl.push(
        this.fb.control(undefined, Validators.required)
      );

      // Set the selected reviewer to view its information
      this.selectedDetailReviewer = selectedReviewer;
    } else {
      // Remove the select field and information field when the user clear their input
      this.formReviewersControl.removeAt(index);
      this.selectedDetailReviewer = undefined;
    }
  }

  /**
   * Check reviewer detail button event handler.
   * Show the selected reviewer information below all the select fields.
   * @param index The index in the reviewers form array
   */
  onCheckReviewerDetail(index: number) {
    this.selectedDetailReviewer = this.formReviewersControl.at(index).value;
  }

  /**
   * Open the confirmation modal.
   * If the user confirmed their action, the request will be sent
   * @param modal Reference to the modal ng-template
   */
  onConfirming(modal: TemplateRef<ElementRef>) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: 'confirmation-modal',
        centered: true,
      })
      .result.then((isConfirmed: boolean) => {
        if (isConfirmed) {
          this._onSubmit();
        }
      });
  }
}
