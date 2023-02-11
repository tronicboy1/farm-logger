import { Injectable } from '@angular/core';
import { PlantService } from '../plant.service';
import { StrawberryPlant } from './strawberry.model';

@Injectable({
  providedIn: 'root',
})
export class StrawberryService extends PlantService<StrawberryPlant> {
  protected getBasePath(farmId: string, areaId: string): string {
    return `farms/${farmId}/areas/${areaId}/strawberries`;
  }
}
