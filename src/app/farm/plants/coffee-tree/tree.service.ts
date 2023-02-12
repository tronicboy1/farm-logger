import { Injectable } from '@angular/core';
import { PlantTypes } from '../plant.model';
import { PlantService } from '../plant.service';
import { CoffeeTree } from './tree.model';

@Injectable({
  providedIn: 'root',
})
export class TreeService extends PlantService<CoffeeTree> {
  protected plantType = PlantTypes.CoffeeTree;
}
