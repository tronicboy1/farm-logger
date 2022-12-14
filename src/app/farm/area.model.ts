import { Cropdust } from './cropdust.service';
import { Fertilization } from './fertilization.service';
import { CoffeeTree } from './tree.model';

export type Area = {
  name: string;
  createdAt: number;
  location?: [number, number, number | null];
  trees: Record<string, CoffeeTree>;
  fertilizations: Record<string, Fertilization>;
  cropdusts: Record<string, Cropdust>;
};

export type AreaWithId = { id: string } & Area;
