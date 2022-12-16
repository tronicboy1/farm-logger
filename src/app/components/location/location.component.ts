import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject, catchError, finalize, of } from 'rxjs';
import { GeolocationService } from 'src/app/farm/util/geolocation.service';

export type Location = [number, number, number | null];

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationComponent implements OnInit {
  @Input() googleMapsURL?: SafeResourceUrl;
  public locationError = new BehaviorSubject(false);
  public showMap = new BehaviorSubject(false);
  public loading = new BehaviorSubject(false);

  @Output() location = new EventEmitter<Location>();

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit(): void {}

  public toggleMap = (force?: boolean) => this.showMap.next(force ?? !this.showMap.value);
  public handleLocationClick() {
    this.loading.next(true);
    this.locationError.next(false);
    this.geolocationService
      .aquireLocation()
      .pipe(
        catchError((err) => {
          this.locationError.next(true);
          return of();
        }),
        finalize(() => {
          this.loading.next(false);
        }),
      )
      .subscribe({ next: (location) => this.location.emit(location) });
  }

  public handleLocationFormSubmit(location: Location) {
    this.locationError.next(false);
    this.location.emit(location);
  }
}
