import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@user/auth.service";
import { UserService } from "@user/user.service";
import { combineLatest, finalize, forkJoin, interval, map, mergeMap, Subscription, switchMap, take } from "rxjs";
import { Farm } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  public farms: Farm[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private farmService: FarmService, private userService: UserService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService
        .getUid()
        .pipe(
          take(1),
          switchMap((uid) => this.farmService.loadFarms(uid)),
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
        )
        .subscribe((farms) => {
          this.farms = farms;
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
