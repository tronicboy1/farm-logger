export type Fertilization = {
  completedAt: number;
  type: FertilizationType;
  note: string;
};
export enum FertilizationType {
  Compost,
  Artificial,
  Leaf,
  Other,
  Watering,
}
export const fertilizationTypeText = new Map<FertilizationType, string>([
  [FertilizationType.Artificial, $localize`Artificial`],
  [FertilizationType.Compost, $localize`Compost`],
  [FertilizationType.Leaf, $localize`Green Leaf`],
  [FertilizationType.Other, $localize`Other`],
  [FertilizationType.Watering, $localize`Watering`],
]);
export type FertilizationWithId = Fertilization & { id: string };
