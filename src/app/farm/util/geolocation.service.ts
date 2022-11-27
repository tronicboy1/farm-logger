import { Injectable } from "@angular/core";
import { FarmModule } from "../farm.module";

@Injectable({
  providedIn: FarmModule,
})
export class GeolocationService {
  constructor() {}

  public aquireLocation(cache = false): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve([position.coords.latitude, position.coords.longitude]),
        reject,
        { enableHighAccuracy: true, maximumAge: cache ? Infinity : 0 },
      );
    });
  }
}
