import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, of, throwError } from 'rxjs';
import * as moment from 'moment';

import { GroupQuestion } from '@/models/group';
import { AuthenticationService, GroupService } from '@/services';

@Component({
  selector: 'app-group-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class GroupQuestionsComponent implements OnInit {
  questions: GroupQuestion[] = [];

  loading = false; // Whether the questions being fetched
  error = ''; // The error message

  // Icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private authService: AuthenticationService,
    private groupService: GroupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Get group's ID from url param

    this.loading = true;

    // Get the group's members information along with last_viewed_at
    this.groupService
      .getGroupUsersByGroupId(id)
      .pipe(
        switchMap((result) => {
          // Checking for conditions
          // Get current logged user
          const currentUser = this.authService.currentUserValue;

          // Typescript type safety check, most likely will not trigger
          if (!currentUser) {
            return throwError(new Error("User hasn't signed up"));
          }

          // Find the information about the current logged user in the group's members
          const member = result.find((_) => _.user_id === currentUser.id);

          // If the current logged user is not within this group's members
          if (!member) {
            return throwError(new Error('You are not within this group'));
          }

          // Check for last view at
          const lastViewedAt = moment.utc(member.last_viewed_at.date);
          const now = moment();

          if (now.diff(lastViewedAt, 'hours') <= 24) {
            return throwError(
              new Error(
                "You have viewed this group's overall Q&As once for the past 24 hours! Please wait before you can view it again."
              )
            );
          }

          // Combine group's members and group's questions to render them to the user
          return combineLatest([
            of(result), // Group's members
            this.groupService.getGroupQuestions(id), // Get group's questions from API call
            this.groupService.previewCompose(id), // Trigger preview compose event to update last_viewed_at date
          ]);
        }),
        switchMap(([members, questions, previewResult]) => {
          // Check if the preview compose event has been successfully triggered
          if (previewResult.status) {
            // Populate member's user information to the fetched questions
            return of(
              questions.map<GroupQuestion>((question) => {
                const member = members.find(
                  (member) => member.id === question.group_user.user_id
                );

                return {
                  ...question,
                  group_user: {
                    ...question.group_user,
                    user: member!.user,
                  },
                };
              })
            );
          }
          return throwError(
            new Error(
              'There was an error in the process! Please try again later.'
            )
          );
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (result) => {
          this.questions = result;
        },
        error: (error) => {
          this.error =
            error.message ||
            'There was an error in the process! Please try again later.';
        },
      });
  }
}
