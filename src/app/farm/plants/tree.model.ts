import { AbstractControl } from '@angular/forms';

export type CoffeeTree = {
  regularId: number;
  species: string;
  startHeight: number;
};

type ToFormGroupType<T> = { [key in keyof T]: AbstractControl<T[key]> };

export type CoffeeTreeForm = ToFormGroupType<CoffeeTree>;

export type CoffeeTreeReport = {
  photoURL?: string;
  photoPath: string;
  createdAt: number;
  notes: string;
  height: number;
  budding: BuddingConditions;
  beanYield: YieldConditions;
  individualFertilization?: boolean;
};

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

export type CoffeeTreeReportWithId = CoffeeTreeReport & { id: string };

export type CoffeeTreeWithId = { id: string } & CoffeeTree;
