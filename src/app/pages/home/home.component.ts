import { Component, inject } from '@angular/core';
import { UserService } from 'ngx-firebase-user-platform';
import { combineLatest, map, switchMap } from 'rxjs';
import { FarmService } from 'src/app/farm/farm.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private farmService = inject(FarmService);
  private userService = inject(UserService);

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
}
