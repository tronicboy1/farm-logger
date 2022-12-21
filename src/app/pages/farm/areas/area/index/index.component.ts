import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, map, mergeMap, tap } from 'rxjs';
import { Location } from 'src/app/components/location/location.component';
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
  );
  readonly areaEditTitle$ = this.area.pipe(map((area) => `${area.name}区域編集`));
  readonly googleMapsURL = this.area.pipe(map((area) => this.geolocationService.getGoogleMapsURL(area)));
  readonly showEditModal$ = new BehaviorSubject(false);

  setLocation(location: Location) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.areaService.updateArea(farmId, areaId, { location })))
      .subscribe();
  }

  toggleShowEditModal = (force?: boolean) => this.showEditModal$.next(force ?? !this.showEditModal$.value);
}
