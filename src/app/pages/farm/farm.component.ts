import { Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { catchError, first, forkJoin, map, Subscription, switchMap } from "rxjs";
import { Farm } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";
import { GeolocationService } from "src/app/farm/util/geolocation.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-farm",
  templateUrl: "./farm.component.html",
  styleUrls: ["./farm.component.css"],
})
export class FarmComponent implements OnInit, OnDestroy {
  public farm?: Farm;
  public googleMapsURL?: SafeResourceUrl;
  public locationError = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private farmService: FarmService,
    private sanitizer: DomSanitizer,
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
          this.setGoogleMapsURL(farm);
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private setGoogleMapsURL(farm: Farm) {
    if (!farm.location) return (this.googleMapsURL = undefined);
    const url = new URL("https://www.google.com/maps/embed/v1/place");
    url.searchParams.set("key", environment.googleMapsAPIKey);
    url.searchParams.set("center", `${farm.location[0]},${farm.location[1]}`);
    url.searchParams.set("q", `${farm.location[0]},${farm.location[1]}`);
    url.searchParams.set("zoom", "19");
    return (this.googleMapsURL = this.sanitizer.bypassSecurityTrustResourceUrl(url.toString()));
  }

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
          return [location, farmId] as [[number, number], string];
        }),
        switchMap(([location, farmId]) => this.farmService.updateFarm(farmId, { location })),
      )
      .subscribe();
  }
}
