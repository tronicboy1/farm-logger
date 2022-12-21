import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { map, mergeMap, Observable } from 'rxjs';
import { Location } from 'src/app/components/location/location.component';
import { Area } from 'src/app/farm/area.model';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaRouteParamsComponent } from './route-params.inheritable';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
})
export class AreaComponent extends AreaRouteParamsComponent implements OnInit {
  public area = new Observable<Area>();
  public googleMapsURL = new Observable<SafeResourceUrl | undefined>();
  constructor(private geolocationService: GeolocationService, private logService: LogService) {
    super();
  }

  ngOnInit(): void {
    this.area = this.getFarmIdAndAreaId().pipe(
      mergeMap(([farmId, areaId]) => this.areaService.watchArea(farmId, areaId)),
    );
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.logService.addLog(farmId, LogActions.ViewArea, areaId)))
      .subscribe();
    this.googleMapsURL = this.area.pipe(map((area) => this.geolocationService.getGoogleMapsURL(area)));
  }

  setLocation(location: Location) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.areaService.updateArea(farmId, areaId, { location })))
      .subscribe();
  }
}
