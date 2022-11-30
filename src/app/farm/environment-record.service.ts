import { Injectable } from "@angular/core";
import { FarmModule } from "./farm.module";

export type EnvironmentRecord = {
  createdAt: number;
  weather: string;
  high: number;
  low: number;
  solarRadiation?: number;
  windSpeed: number;
  rainfall: number;
};

@Injectable({
  providedIn: FarmModule,
})
export class EnvironmentRecordService {
  constructor() {}
}
