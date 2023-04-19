import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '@/services/index';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  userId: number;
  userForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    school: [{value: '', disabled: true}],
    verified: [false, Validators.required],
    suspended: [false, Validators.required]
  });
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.userId = route.snapshot.params['id'];
    this.getUser();
  }

  ngOnInit(): void {
  }

  getUser() {
    this.userService.getById(this.userId).pipe(first()).subscribe((res: any) => {
      this.setUserData(res.user);
      this.loading = false;
    });
  }

  get f() { return this.userForm.controls; }

  setUserData(user: any) {
    this.f.firstName.setValue(user.firstName);
    this.f.lastName.setValue(user.lastName);
    this.f.email.setValue(user.email);
    this.f.verified.setValue(user.verified);
    this.f.suspended.setValue(user.suspended);
    this.f.school.setValue(user.school.school_name);
  }

  onSuspend() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }

    this.loading = true;

    this.userService.suspend(this.userId)
      .pipe(first())
      .subscribe(
        data => {
          this.getUser();
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  onRestore() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
        return;
    }

    this.loading = true;

    this.userService.restore(this.userId)
      .pipe(first())
      .subscribe(
        data => {
          this.getUser();
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}
