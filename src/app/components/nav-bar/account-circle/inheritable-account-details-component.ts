import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import type { User } from 'firebase/auth';
import { AuthService } from 'ngx-firebase-user-platform';
import type { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class InheritableAccountDetailsComponent implements OnInit, OnDestroy {
  public loading = false;
  public user?: User;
  @Output()
  public submitted = new EventEmitter<null>();

  protected subscriptions: Subscription[] = [];

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.waitForUser().subscribe((user) => {
        this.user = user;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
