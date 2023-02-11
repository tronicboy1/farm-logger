import type { AbstractControl } from "@angular/forms";

export interface Plant {
  regularId: number;
  species: string;
  startHeight: number;
}

export interface PlantReport {
  photoURL?: string;
  photoPath: string;
  createdAt: number;
  notes: string;
  height: number;
  individualFertilization?: boolean;
}

interface IncludeId {
  id: string;
}
export interface PlantReportWithId extends PlantReport, IncludeId {}
export interface PlantWithId extends Plant, IncludeId {}

export type ToFormGroupType<T> = { [key in keyof T]: AbstractControl<T[key]> };
