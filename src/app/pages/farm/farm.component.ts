import { Component, OnDestroy, OnInit } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { catchError, first, forkJoin, map, Subscription, switchMap } from "rxjs";
import { Farm } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";
import { GeolocationService } from "src/app/farm/util/geolocation.service";

@Component({
  selector: "app-farm",
  templateUrl: "./farm.component.html",
  styleUrls: ["./farm.component.css"],
})
export class FarmComponent implements OnInit, OnDestroy {
  public farm?: Farm;
  public googleMapsURL?: SafeResourceUrl;
  public locationError = false;
  public showMap = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private farmService: FarmService,
    private geolocationService: GeolocationService,
  ) {}

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
          this.googleMapsURL = this.geolocationService.getGoogleMapsURL(farm);
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public toggleMap = (force?: boolean) => (this.showMap = force ?? !this.showMap);
  public handleLocationClick() {
    this.locationError = false;
    forkJoin([this.geolocationService.aquireLocation(), this.route.params.pipe(first())])
      .pipe(
        catchError((err) => {
          this.locationError = true;
          throw err;
        }),
        map(([location, params]) => {
          const { farmId } = params;
          if (typeof farmId !== "string") throw TypeError("Farm ID was not in params.");
          return [location, farmId] as const;
        }),
        switchMap(([location, farmId]) => this.farmService.updateFarm(farmId, { location })),
      )
      .subscribe();
  }
}
