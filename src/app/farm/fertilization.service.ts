import { Injectable } from "@angular/core";
import { FarmModule } from "./farm.module";

export type Fertilization = {
  completedAt: number;
  type: string;
};

@Injectable({
  providedIn: FarmModule,
})
export class FertilizationService {
  constructor() {}
}
