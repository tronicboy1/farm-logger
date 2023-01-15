import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'ngx-firebase-user-platform';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { FarmService } from 'src/app/farm/farm.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public farms = this.farmService.loadMyFarms().pipe(
    switchMap((farms) =>
      combineLatest(
        farms.map((farm) =>
          combineLatest(
            farm.adminMembers.map((uid) =>
              this.userService.watchUserDoc(uid).pipe(
                map((userData) => ({
                  name: userData.displayName ?? userData.email,
                  photoURL: userData.photoURL,
                })),
              ),
            ),
          ).pipe(map((usernames) => ({ ...farm, adminMembers: usernames }))),
        ),
      ),
    ),
  );
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();

  constructor(private farmService: FarmService, private userService: UserService, private router: Router) {}

  public handleFarmClick(farmId: string) {
    this.router.navigate(['/farms', farmId], { queryParams: { 'show-logs': true } });
  }
  public toggleAddModal(force?: boolean) {
    this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  }
}
