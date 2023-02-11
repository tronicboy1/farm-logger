import { Plant, PlantReport, PlantReportWithId, PlantWithId, ToFormGroupType } from '../plant.model';

export interface CoffeeTree extends Plant {}
export interface CoffeeTreeReport extends PlantReport {
  budding: BuddingConditions;
  beanYield: YieldConditions;
}

export interface CoffeeTreeReportWithId extends CoffeeTreeReport, PlantReportWithId {}

export interface CoffeeTreeWithId extends CoffeeTree, PlantWithId {}
export type CoffeeTreeForm = ToFormGroupType<CoffeeTree>;

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
