import {
  IncludeId,
  Plant,
  PlantReport,
  PlantReportWithId,
  PlantTypes,
  PlantWithId,
  ToFormGroupType,
} from '../plant.model';

export interface CoffeeTree extends Plant {
  startHeight: number;
  plantType: PlantTypes.CoffeeTree;
}
export interface CoffeeTreeReport extends PlantReport {
  budding: BuddingConditions;
  beanYield: YieldConditions;
}

export interface CoffeeTreeReportWithId extends CoffeeTreeReport, PlantReportWithId {}

export interface CoffeeTreeWithId extends CoffeeTree, IncludeId {}
export type CoffeeTreeForm = ToFormGroupType<Omit<CoffeeTree, 'plantType'>>;

export enum BuddingConditions {
  Good,
  Poor,
  NotYet,
}
export const buddingConditionsText = new Map<BuddingConditions, string>([
  [BuddingConditions.Good, $localize`Good`],
  [BuddingConditions.Poor, $localize`Poor`],
  [BuddingConditions.NotYet, $localize`No Budding`],
]);

export enum YieldConditions {
  Good,
  Poor,
  NotYet,
}
export const yieldConditionsText = new Map<YieldConditions, string>([
  [YieldConditions.Good, $localize`Good`],
  [YieldConditions.Poor, $localize`Poor`],
  [YieldConditions.NotYet, $localize`No Yield`],
]);
