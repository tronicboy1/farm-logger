import { Injectable } from "@angular/core";
import { from, map, switchMap } from "rxjs";
import { GeolocationService } from "./geolocation.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  static key = "a4d7ce1f7e70a4cebb0c4b9c4880c42d";

  constructor(private geolocationService: GeolocationService, private http: HttpClient) {}

  public getWeatherReport() {
    return from(this.geolocationService.aquireLocation(true)).pipe(
      switchMap(([lat, lon]) => {
        const url = new URL("https://api.openweathermap.org/data/3.0/onecall");
        url.searchParams.set("lat", String(lat));
        url.searchParams.set("lon", String(lon));
        url.searchParams.set("appid", WeatherService.key);
        url.searchParams.set("units", "metric");
        url.searchParams.set("lang", "ja");
        return this.http.get(URL.toString(), { observe: "body", responseType: "json" });
      }),
      //map((results: unknown) => )
    );
  }
}
