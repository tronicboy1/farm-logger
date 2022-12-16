import { Injectable } from "@angular/core";
import { LogModule } from "./log.module";

@Injectable({
  providedIn: LogModule,
})
export class LogService {
  constructor() {}
}
