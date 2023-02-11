import { Injectable } from '@angular/core';
import { PlantService } from '../plant.service';
import { CoffeeTree } from './tree.model';

@Injectable({
  providedIn: 'root',
})
export class TreeService extends PlantService<CoffeeTree> {
  protected getBasePath(farmId: string, areaId: string) {
    return `farms/${farmId}/areas/${areaId}/trees`;
  }
}
