import { Plant, PlantReport, PlantTypes } from '../plant.model';

export interface StrawberryPlant extends Plant {
  plantType: PlantTypes.StrawberryPlant;
}
export interface StrawberryReport extends PlantReport {
  flowering: StrawberryFlowering;
  pollination: boolean;
}

export enum StrawberryFlowering {
  NotYet,
  Good,
  Poor,
}
