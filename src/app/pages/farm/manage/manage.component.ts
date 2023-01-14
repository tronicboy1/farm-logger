import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationArray } from '@tronicboy/ngx-geolocation';
import { BehaviorSubject, map, shareReplay, switchMap } from 'rxjs';
import { FarmService } from 'src/app/farm/farm.service';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';
import { ManageInheritable } from './inheritable';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageComponent extends ManageInheritable {
  public farm$ = this.getFarmId().pipe(
    switchMap((farmId) => {
      return this.farmService.watchFarm(farmId);
    }),
    shareReplay(1),
  );
  public googleMapsURL$ = this.farm$.pipe(map((farm) => this.geolocationService.getGoogleMapsURL(farm)));
  private showMap = new BehaviorSubject(false);
  readonly showMap$ = this.showMap.asObservable();
  private showDeleteModal = new BehaviorSubject(false);
  readonly showDeleteModal$ = this.showDeleteModal.asObservable();

  constructor(
    private farmService: FarmService,
    private geolocationService: GeolocationService,
    private router: Router,
  ) {
    super();
  }

  toggleDeleteModal = (force?: boolean) => this.showDeleteModal.next(force ?? !this.showDeleteModal.value);
  handleDeleteFarm() {
    this.router.navigateByUrl('/home');
  }
  toggleMap = (force?: boolean) => this.showMap.next(force ?? !this.showMap.value);
  handleLocationClick(location: LocationArray) {
    this.getFarmId()
      .pipe(switchMap((farmId) => this.farmService.updateFarm(farmId, { location })))
      .subscribe();
  }
}
