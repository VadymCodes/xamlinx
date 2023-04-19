import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService, UserService } from '@/services/index';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  verificationCode;
  error = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) {
    this.verificationCode = route.snapshot.params['code'];
  }

  ngOnInit(): void {
    if (this.verificationCode) {
      this.userService.verifyEmail(this.verificationCode).pipe(first()).subscribe(res => {
        if (res.success) {
          this.authenticationService.me().pipe(first()).subscribe(() => {
            this.router.navigate(['/exams']);
          });
        } else {
          this.error = true;
        }
      });
    }
  }

}
