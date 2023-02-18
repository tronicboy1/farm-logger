import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from '@farm/area.service';
import { plantTypePaths } from '@farm/plants/plant.model';
import { LocationArray } from '@tronicboy/ngx-geolocation';
import { filter, first, forkJoin, map, mergeMap, shareReplay, tap } from 'rxjs';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaRouteParamsComponent } from './route-params.inheritable';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
})
export class AreaComponent implements OnInit {
  private areaService = inject(AreaService);
  private route = inject(ActivatedRoute);
  private geolocationService = inject(GeolocationService);
  private logService = inject(LogService);

  area = this.getFarmIdAndAreaId().pipe(
    mergeMap(([farmId, areaId]) => this.areaService.watchArea(farmId, areaId)),
    shareReplay(1),
  );
  googleMapsURL = this.area.pipe(map((area) => this.geolocationService.getGoogleMapsURL(area)));
  plantsLink$ = this.area.pipe(AreaService.getPlantsLink);

  ngOnInit(): void {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.logService.addLog(farmId, LogActions.ViewArea, areaId)))
      .subscribe();
  }

  setLocation(location: LocationArray) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.areaService.updateArea(farmId, areaId, { location })))
      .subscribe();
  }

  private getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.params.pipe(
        filter(({ farmId }) => Boolean(farmId)),
        map(({ farmId }) => {
          if (typeof farmId !== 'string') throw TypeError('no farmId');
          return farmId;
        }),
      ),
      this.route.params.pipe(
        filter(({ areaId }) => Boolean(areaId)),
        map(({ areaId }) => {
          if (typeof areaId !== 'string') throw TypeError('no areaId');
          return areaId;
        }),
      ),
    ].map((param$) => param$.pipe(first()));
    return forkJoin(params$);
  }
}
