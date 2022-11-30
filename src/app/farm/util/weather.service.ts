import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { FarmModule } from "../farm.module";

export type WeatherReport = {
  coord: { lon: number; lat: number };
  weather: [{ id: number; main: string; description: string; icon: string }];
  base: string;
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: { type: number; id: number; country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

@Injectable({
  providedIn: FarmModule,
})
export class WeatherService {
  static key = environment.weatherAPIKey;
  private cache?: {};

  constructor(private http: HttpClient) {}

  public getWeatherReport(lat: number, lon: number) {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("appid", WeatherService.key);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "ja");
    return this.http.get<WeatherReport>(url.toString(), { observe: "body", responseType: "json" });
  }
}
