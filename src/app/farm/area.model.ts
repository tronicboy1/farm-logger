import { Cropdust } from './cropdust.service';
import { Fertilization } from './fertilization.model';
import { PlantTypes } from './plants/plant.model';

export type Area = {
  name: string;
  createdAt: number;
  location?: [number, number, number | null];
  fertilizations: Record<string, Fertilization>;
  cropdusts: Record<string, Cropdust>;
  plantType: PlantTypes;
};

export type AreaWithId = { id: string } & Area;
