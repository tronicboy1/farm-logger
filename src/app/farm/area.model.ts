import { CoffeeTree } from "./tree.model";

export type Area = {
  name: string;
  trees: Record<string, CoffeeTree>;
};
