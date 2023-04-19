import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faEye,
  faPlus,
  faArrowRight,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

import { ExamService } from '@/services';
import { ReviewerService } from '@/services/reviewer.service';
import { ToastService } from '@/services/toast.service';

@Component({
  selector: 'app-exam-review',
  templateUrl: './exam-review.component.html',
  styleUrls: ['./exam-review.component.scss'],
})
export class ExamReviewComponent implements OnInit {
  // Icons
  faEye = faEye;
  faPlus = faPlus;
  faArrowRight = faArrowRight;
  faTrash = faTrash;
  faEdit = faEdit;

  // Form
  form = this.fb.group({
    exam_id: [0, Validators.required],
    result: ['sme-unchanged', Validators.required],
    questions_and_solutions: this.fb.array([]),
  });

  // States
  selectedQuestion: number = -1; // Selected question to render solution panel
  isPreview = {
    questions: false, // Whether question panel on preview state
    solutions: false, // Whether solution panel on preview state
  };
  loading = true; // Whether fetching exam
  submitting = false; // Whether submitting request

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private reviewerService: ReviewerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const examId = params.id; // Get exam ID from url params

      this.loading = true; // Set the page state to loading

      // Get Exam from Exam ID
      this.examService.getExamById(examId).subscribe((exam) => {
        if (exam) {
          // Optional check to make sure exam is fetched

          this.loading = false; // Set the page state to render content
          this.form.get('exam_id')?.setValue(exam.id); // Set fetched exam ID to the form

          if (exam.qa_mode) {
            this.qasForm.clear();

            exam.qas!.forEach((qas) => {
              this.qasForm.push(
                this.fb.group({
                  question: [qas.question, Validators.required],
                  solution: [qas.solution, Validators.required],
                })
              );
            });
          }
        } else {
          this.router.navigate(['/']); // Navigate back if exam not found
        }
      });
    });
  }

  /**
   * Convenient getter to get the questions and solutions form array
   */
  get qasForm() {
    return this.form.get('questions_and_solutions') as FormArray;
  }

  /**
   * Convenient getter to get the question text of the selected question
   */
  get selectedQuestionText() {
    return this.qasForm.controls[this.selectedQuestion].get('question')
      ?.value as string;
  }

  /**
   * Add question button click event handler
   * Add new form group with question and solution fields to the form
   */
  onAddQuestion() {
    this.qasForm.push(
      this.fb.group({
        question: ['', Validators.required],
        solution: ['', Validators.required],
      })
    );
  }

  /**
   * Delete question button click event handler
   * Delete question and solution form group at provided index
   * @param index The index of the deleting question
   */
  onDeleteQuestion(index: number) {
    this.qasForm.removeAt(index);
  }

  /**
   * Select question icon button click handler
   * Render the solution panel according to the selected question
   * @param index The index of the selected question
   */
  onSelectQuestion(index: number) {
    this.selectedQuestion = index;
  }

  /**
   * Preview icon button click handler
   * Switch the textarea input to MathJax window to preview the syntax
   * @param section The selected section to preview
   */
  onPreview(section: 'questions' | 'solutions') {
    this.isPreview = {
      ...this.isPreview,
      [section]: !this.isPreview[section],
    };
  }

  onSubmit(result: 'sme-unchanged' | 'sme-modified' | 'sme-rejected') {
    const payload = this.form.value;

    payload.result = result;

    if (result !== 'sme-modified') {
      payload.questions_and_solutions = undefined;
    }

    this.submitting = true;

    this.reviewerService.reviewExam(payload).subscribe(
      () => {
        this.router.navigate(['/', 'reviewer', 'exams']);

        this.toastService.show({
          content: 'Successfully reviewed the exam!',
          type: 'success',
        });
      },
      (error) => {
        this.toastService.show({
          content: error,
          type: 'danger',
        });
      },
      () => {
        this.submitting = false;
      }
    );
  }
}
