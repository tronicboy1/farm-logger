import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AreaService } from '@farm/area.service';
import { LocationArray } from '@tronicboy/ngx-geolocation';
import { BehaviorSubject, map, mergeMap, shareReplay, tap } from 'rxjs';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';
import { AreaRouteParamsComponent } from '../route-params.inheritable';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaIndexComponent extends AreaRouteParamsComponent {
  private geolocationService = inject(GeolocationService);
  readonly area = this.getFarmIdAndAreaId().pipe(
    mergeMap(([farmId, areaId]) => this.areaService.watchArea(farmId, areaId)),
    shareReplay(1),
  );
  readonly plantsLink$ = this.area.pipe(AreaService.getPlantsLink);
  readonly areaEditTitle$ = this.area.pipe(map((area) => `${area.name}区域編集`));
  readonly googleMapsURL = this.area.pipe(map((area) => this.geolocationService.getGoogleMapsURL(area)));
  readonly showEditModal$ = new BehaviorSubject(false);

  setLocation(location: LocationArray) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.areaService.updateArea(farmId, areaId, { location })))
      .subscribe();
  }

  toggleShowEditModal = (force?: boolean) => this.showEditModal$.next(force ?? !this.showEditModal$.value);
}
