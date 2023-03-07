import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, first, map, mergeMap, of, ReplaySubject, tap } from 'rxjs';
import { FarmService } from 'src/app/farm/farm.service';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';
import { WeatherService } from 'src/app/farm/util/weather.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { EnvironmentRecordService } from './environment-record.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironmentComponent {
  readonly environmentRecords$ = this.route.parent!.params.pipe(
    first(),
    map((params) => {
      const { farmId } = params;
      if (typeof farmId !== 'string') throw TypeError();
      return farmId;
    }),
    mergeMap((farmId) => this.environmentService.watchAll(this, farmId)),
  );
  private loadingSubject = new ReplaySubject<boolean>(1);
  public loading = this.loadingSubject.asObservable();
  public error = new BehaviorSubject(false);

  constructor(
    private environmentService: EnvironmentRecordService,
    private route: ActivatedRoute,
    private geolocationService: GeolocationService,
    private farmService: FarmService,
    private weatherService: WeatherService,
    private logService: LogService,
  ) {}

  public loadNextPage() {
    this.environmentService.triggerNextPage(this);
  }
  public handleFormSubmit() {
    this.error.next(false);
  }

  public addRecord() {
    this.loadingSubject.next(true);
    let farmIdCache: string;
    this.route
      .parent!.params.pipe(
        first(),
        map((params) => {
          const { farmId } = params;
          if (typeof farmId !== 'string') throw TypeError();
          return farmId;
        }),
        tap({
          next: (farmId) => this.logService.addLog(farmId, LogActions.AddWeatherData).subscribe(),
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
          this.environmentService.clearPaginationCache(this);
          this.loadingSubject.next(false);
        }),
      )
      .subscribe({
        error: () => this.error.next(true),
      });
  }
}
