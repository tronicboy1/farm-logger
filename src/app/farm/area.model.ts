import { Cropdust } from "./cropdust.service";
import { Fertilization } from "./fertilization.service";
import { CoffeeTree } from "./tree.model";

export type Area = {
  name: string;
  trees: Record<string, CoffeeTree>;
  fertilizations: Record<string, Fertilization>;
  cropdusts: Record<string, Cropdust>;
};
