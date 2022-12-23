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
  budding: string;
  beanYield: string;
};

export type CoffeeTreeReportWithId = CoffeeTreeReport & { id: string };

export type CoffeeTreeWithId = { id: string } & CoffeeTree;
