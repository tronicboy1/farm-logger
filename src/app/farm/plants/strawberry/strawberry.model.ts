import { Plant, PlantReport, PlantTypes } from '../plant.model';

export interface StrawberryPlant extends Plant {
  plantType: PlantTypes.StrawberryPlant;
  startingWidth: number;
}
export interface StrawberryReport extends PlantReport {
  flowering: StrawberryFlowering;
  pollination: boolean;
  width: number;
}

export enum StrawberryFlowering {
  NotYet,
  Good,
  Poor,
}
