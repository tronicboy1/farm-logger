import { Injectable } from '@angular/core';
import { PlantTypes } from '../plant.model';
import { PlantService } from '../plant.service';
import { StrawberryPlant } from './strawberry.model';

@Injectable({
  providedIn: 'root',
})
export class StrawberryService extends PlantService<StrawberryPlant> {
  protected plantType = PlantTypes.StrawberryPlant;
}
