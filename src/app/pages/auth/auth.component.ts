import { Component, OnInit } from '@angular/core';
import '@web-components/google-icon';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { Utils } from '@lib/utils';
import { take } from 'rxjs';
import { AuthService } from 'ngx-firebase-user-platform';

type AuthNavModes = 'LOGIN' | 'REGISTER';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  public showSendEmailModal = false;
  public showResetPasswordModal = false;
  public mode: AuthNavModes = 'LOGIN';
  public error = '';
  public loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService
      .getAuthState()
      .pipe(take(1))
      .subscribe((user) => {
        if (user) this.router.navigateByUrl('/home');
      });
  }

  public handleLoginSubmit: EventListener = (event) => {
    const { formData } = Utils.getFormData(event);
    const email = formData.get('email')!.toString().trim();
    const password = formData.get('password')!.toString().trim();
    const loginPromise =
      this.mode === 'LOGIN'
        ? this.authService.signInUser(email, password)
        : this.authService.createUser(email, password);
    this.setLoading(loginPromise).then(() => {
      this.router.navigateByUrl('/home');
    });
  };

  public handleSendEmailSubmit: EventListener = (event) => {
    const { formData } = Utils.getFormData(event);
    const email = formData.get('email')!.toString().trim();
    this.setLoading(this.authService.sendSignInEmail(email, window.location.origin)).then(
      () => (this.showSendEmailModal = false),
    );
  };

  public handleResetPasswordSubmit: EventListener = (event) => {
    const { formData } = Utils.getFormData(event);
    const email = formData.get('email')!.toString().trim();
    this.setLoading(this.authService.sendPasswordResetEmail(email)).then(() => (this.showResetPasswordModal = false));
  };

  private setLoading<T>(promise: Promise<T>) {
    this.loading = true;
    this.error = '';
    return Promise.resolve(promise)
      .catch((error) => {
        if (!(error instanceof FirebaseError)) return;
        this.error = error.message;
      })
      .finally(() => (this.loading = false));
  }

  public handleAuthNavClick(mode: AuthNavModes) {
    this.mode = mode;
  }
  public toggleSendEmailModal = (value?: boolean) => (this.showSendEmailModal = value ?? !this.showSendEmailModal);
  public toggleResetPasswordModal = (value?: boolean) =>
    (this.showResetPasswordModal = value ?? !this.showResetPasswordModal);
}
