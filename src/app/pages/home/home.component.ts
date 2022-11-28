import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@user/auth.service";
import { finalize, forkJoin, mergeMap, Subscription, switchMap, take } from "rxjs";
import { Farm } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  public farms: Farm[] = [];
  public newFarmForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64), Validators.minLength(1)]),
  });

  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private farmService: FarmService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService
        .getUid()
        .pipe(
          switchMap((uid) => forkJoin([this.farmService.getAdminFarms(uid), this.farmService.getObservedFarms(uid)])),
        )
        .subscribe(([admin, observer]) => {
          this.farms = [...admin, ...observer];
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public handleFarmSubmit() {
    if (this.newFarmForm.invalid) return;
    const name = this.newFarmForm.controls.name.value!.trim();
    this.authService
      .getUid()
      .pipe(
        take(1),
        mergeMap((uid) =>
          this.farmService.createFarm({ name, adminMembers: [uid], observerMembers: [], createdAt: Date.now() }),
        ),
        finalize(() => this.newFarmForm.reset()),
      )
      .subscribe();
  }
}
