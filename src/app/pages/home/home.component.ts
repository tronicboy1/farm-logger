import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'ngx-firebase-user-platform';
import { BehaviorSubject, combineLatest, map, Observable, Subscription, switchMap } from 'rxjs';
import { FarmWithId } from 'src/app/farm/farm.model';
import { FarmService } from 'src/app/farm/farm.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public farms = new Observable<FarmWithId[]>();
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();

  private subscriptions: Subscription[] = [];

  constructor(private farmService: FarmService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.farms = this.farmService
      .loadMyFarms()
      .pipe(
        switchMap((farms) =>
          combineLatest(
            farms.map((farm) =>
              combineLatest(
                farm.adminMembers.map((uid) =>
                  this.userService.watchUserDoc(uid).pipe(map((userData) => userData.displayName ?? userData.email)),
                ),
              ).pipe(map((usernames) => ({ ...farm, adminMembers: usernames }))),
            ),
          ),
        ),
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public handleFarmClick(farmId: string) {
    this.router.navigate(['/farms', farmId], { queryParams: { 'show-logs': true } });
  }
  public toggleAddModal(force?: boolean) {
    this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  }
}
