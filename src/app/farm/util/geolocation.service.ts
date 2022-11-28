import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { from, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Farm } from "../farm.model";
import { FarmModule } from "../farm.module";

@Injectable({
  providedIn: FarmModule,
})
export class GeolocationService {
  constructor(private sanitizer: DomSanitizer) {}

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

  public getGoogleMapsURL(farm: Farm) {
    if (!farm.location) return undefined;
    const url = new URL("https://www.google.com/maps/embed/v1/place");
    url.searchParams.set("key", environment.googleMapsAPIKey);
    url.searchParams.set("center", `${farm.location[0]},${farm.location[1]}`);
    url.searchParams.set("q", `${farm.location[0]},${farm.location[1]}`);
    url.searchParams.set("zoom", "19");
    return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
  }
}
