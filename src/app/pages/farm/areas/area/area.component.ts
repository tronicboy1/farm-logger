import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { first, forkJoin, map, mergeMap, Observable } from 'rxjs';
import { Location } from 'src/app/components/location/location.component';
import { Area } from 'src/app/farm/area.model';
import { AreaService } from 'src/app/farm/area.service';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
})
export class AreaComponent implements OnInit {
  public area = new Observable<Area>();
  public googleMapsURL = new Observable<SafeResourceUrl | undefined>();
  constructor(
    private route: ActivatedRoute,
    private areaService: AreaService,
    private geolocationService: GeolocationService,
    private logService: LogService,
  ) {}

  ngOnInit(): void {
    this.area = this.getFarmIdAndAreaId().pipe(
      mergeMap(([farmId, areaId]) => this.areaService.watchArea(farmId, areaId)),
    );
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.logService.addLog(farmId, LogActions.ViewArea, areaId)))
      .subscribe();
    this.googleMapsURL = this.area.pipe(map((area) => this.geolocationService.getGoogleMapsURL(area)));
  }

  private getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.params.pipe(
        map(({ farmId }) => {
          if (typeof farmId !== 'string') throw TypeError('no farmId');
          return farmId;
        }),
      ),
      this.route.params.pipe(
        map(({ areaId }) => {
          if (typeof areaId !== 'string') throw TypeError('no areaId');
          return areaId;
        }),
      ),
    ].map((param$) => param$.pipe(first()));
    return forkJoin(params$);
  }

  setLocation(location: Location) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.areaService.updateArea(farmId, areaId, { location })))
      .subscribe();
  }
}
