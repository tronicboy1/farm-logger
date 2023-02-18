import type { AbstractControl } from '@angular/forms';

export interface Plant {
  regularId: number;
  species: string;
  plantType: PlantTypes;
}

export interface PlantReport {
  photoURL?: string;
  photoPath: string;
  createdAt: number;
  notes: string;
  individualFertilization: boolean;
}

export interface IncludeId {
  id: string;
}
export interface PlantReportWithId extends PlantReport, IncludeId {}
export interface PlantWithId extends Plant, IncludeId {}

export enum PlantTypes {
  Plant,
  CoffeeTree,
  StrawberryPlant,
}

export const plantTypePaths = new Map<PlantTypes, string>([
  [PlantTypes.Plant, 'plants'],
  [PlantTypes.CoffeeTree, 'trees'],
  [PlantTypes.StrawberryPlant, 'strawberries'],
]);

export type ToFormGroupType<T> = Omit<{ [key in keyof T]: AbstractControl<T[key]> }, 'plantType'>;
