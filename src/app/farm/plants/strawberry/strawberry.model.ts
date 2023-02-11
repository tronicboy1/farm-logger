import { Plant, PlantReport } from '../plant.model';

export interface StrawberryPlant extends Plant {}
export interface StrawberryReport extends PlantReport {
  flowering: Flowering;
  pollination: boolean;
}

enum Flowering {
  NotYet,
  Good,
  Poor,
}
