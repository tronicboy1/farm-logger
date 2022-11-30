import { Injectable } from "@angular/core";
import { FarmModule } from "./farm.module";

export type Cropdust = {
  completedAt: number;
  type: string;
};

@Injectable({
  providedIn: FarmModule,
})
export class CropdustService {
  constructor() {}
}
