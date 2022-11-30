import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { finalize, first, map, mergeMap, of, scan, Subscription } from "rxjs";
import { EnvironmentRecord, EnvironmentRecordService } from "src/app/farm/environment-record.service";
import { FarmService } from "src/app/farm/farm.service";
import { GeolocationService } from "src/app/farm/util/geolocation.service";
import { WeatherService } from "src/app/farm/util/weather.service";

@Component({
  selector: "app-environment",
  templateUrl: "./environment.component.html",
  styleUrls: ["./environment.component.css"],
})
export class EnvironmentComponent implements OnInit, OnDestroy {
  public environmentRecords: EnvironmentRecord[] = [];
  public loading = false;
  private subscriptions = new Subscription();
  constructor(
    private environmentService: EnvironmentRecordService,
    private route: ActivatedRoute,
    private geolocationService: GeolocationService,
    private farmService: FarmService,
    private weatherService: WeatherService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route
        .parent!.params.pipe(
          first(),
          map((params) => {
            const { farmId } = params;
            if (typeof farmId !== "string") throw TypeError();
            return farmId;
          }),
          mergeMap((farmId) => this.environmentService.watchEnvironmentRecords(farmId)),
        )
        .subscribe((records) => {
          this.environmentRecords = records;
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public addRecord() {
    this.loading = true;
    let farmIdCache: string;
    this.route
      .parent!.params.pipe(
        first(),
        map((params) => {
          const { farmId } = params;
          if (typeof farmId !== "string") throw TypeError();
          return farmId;
        }),
        mergeMap((farmId) => {
          farmIdCache = farmId;
          return this.farmService.getFarm(farmId);
        }),
        mergeMap((farm) => {
          if (farm.location) return of(farm.location);
          return this.geolocationService.aquireLocation();
        }),
        mergeMap(([lat, lon]) => this.weatherService.getWeatherReport(lat, lon)),
        mergeMap((weatherReport) =>
          this.environmentService.createEnvironmentRecord(farmIdCache, {
            createdAt: Date.now(),
            weather: weatherReport.weather[0].description,
            high: weatherReport.main.temp_max,
            low: weatherReport.main.temp_min,
            windSpeed: weatherReport.wind.speed,
            humidity: weatherReport.main.humidity,
            sunrise: weatherReport.sys.sunrise,
            sunset: weatherReport.sys.sunset,
            clouds: weatherReport.clouds.all,
          }),
        ),
        finalize(() => {
          this.environmentService.clearPaginationCache();
          this.loading = false;
        }),
      )
      .subscribe();
  }
}
