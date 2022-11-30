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

  public aquireLocation(cache = false): Observable<[number, number, number | null]> {
    return new Observable<[number, number, number | null]>((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next([position.coords.latitude, position.coords.longitude, position.coords.altitude]);
          observer.complete();
        },
        observer.error,
        { enableHighAccuracy: true, maximumAge: cache ? Infinity : 0 },
      );
    });
  }

  public getGoogleMapsURL(farm: Farm) {
    if (!farm.location) return undefined;
    const url = new URL("https://www.google.com/maps/embed/v1/place");
    url.searchParams.set("key", environment.googleMapsAPIKey);
    url.searchParams.set("center", `${farm.location[0]},${farm.location[1]}`);
    url.searchParams.set("q", `${farm.location[0]},${farm.location[1]}`);
    url.searchParams.set("zoom", "19");
    url.searchParams.set("language", "ja");
    url.searchParams.set("maptype", "satellite");
    return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
  }
}
