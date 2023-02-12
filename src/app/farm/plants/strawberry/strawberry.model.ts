import { Plant, PlantReport, PlantTypes } from '../plant.model';

export interface StrawberryPlant extends Plant {
  plantType: PlantTypes.StrawberryPlant;
}
export interface StrawberryReport extends PlantReport {
  flowering: Flowering;
  pollination: boolean;
}

enum Flowering {
  NotYet,
  Good,
  Poor,
}
