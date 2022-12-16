import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { first, forkJoin, map, mergeMap, Observable } from 'rxjs';
import { Location } from 'src/app/components/location/location.component';
import { Area } from 'src/app/farm/area.model';
import { AreaService } from 'src/app/farm/area.service';
import { CoffeeTree } from 'src/app/farm/tree.model';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class AreaIndexComponent implements OnInit {
  public area = new Observable<Area>();
  public googleMapsURL = new Observable<SafeResourceUrl | undefined>();
  constructor(
    private route: ActivatedRoute,
    private areaService: AreaService,
    private geolocationService: GeolocationService,
  ) {}

  ngOnInit(): void {
    this.area = this.getFarmIdAndAreaId().pipe(
      mergeMap(([farmId, areaId]) => this.areaService.watchArea(farmId, areaId)),
    );
    this.googleMapsURL = this.area.pipe(map((area) => this.geolocationService.getGoogleMapsURL(area)));
  }

  private getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
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
