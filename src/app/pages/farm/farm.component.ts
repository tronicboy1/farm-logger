import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, switchMap } from "rxjs";
import { Farm } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";

@Component({
  selector: "app-farm",
  templateUrl: "./farm.component.html",
  styleUrls: ["./farm.component.css"],
})
export class FarmComponent implements OnInit, OnDestroy {
  public farm?: Farm;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private farmService: FarmService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params
        .pipe(
          switchMap((params) => {
            const { farmId } = params;
            if (typeof farmId !== "string") throw TypeError("Farm ID was not in params.");
            return this.farmService.watchFarm(farmId);
          }),
        )
        .subscribe((farm) => {
          this.farm = farm;
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
