import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { FarmModule } from "../farm.module";

@Injectable({
  providedIn: FarmModule,
})
export class GeolocationService {
  constructor() {}

  public aquireLocation(cache = false): Observable<[number, number]> {
    return from(
      new Promise<[number, number]>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve([position.coords.latitude, position.coords.longitude]),
          reject,
          { enableHighAccuracy: true, maximumAge: cache ? Infinity : 0 },
        );
      }),
    );
  }
}
