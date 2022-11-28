import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "@user/user.service";
import { combineLatest, map, Subscription, switchMap } from "rxjs";
import { FarmWithId } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  public farms: FarmWithId[] = [];
  public showAddFarmForm = false;

  private subscriptions: Subscription[] = [];

  constructor(private farmService: FarmService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.farmService
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
        )
        .subscribe((farms) => {
          this.farms = farms;
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public handleFarmClick(farmId: string) {
    this.router.navigate(["/farms", farmId]);
  }
  public toggleAddFarmForm(force?: boolean) {
    this.showAddFarmForm = force ?? !this.showAddFarmForm;
  }
}
