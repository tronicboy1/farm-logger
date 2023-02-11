import { PlantFactory } from '../plant.factory';
import { BuddingConditions, CoffeeTree, CoffeeTreeReport, YieldConditions } from './tree.model';

export class TreeFactory implements PlantFactory {
  create(params?: Partial<CoffeeTree>): CoffeeTree {
    return Object.assign<CoffeeTree, Partial<CoffeeTree> | undefined>(
      {
        regularId: NaN,
        startHeight: 100,
        species: $localize`Arabica`,
      },
      params,
    );
  }

  createReport(params?: Partial<CoffeeTreeReport>): CoffeeTreeReport {
    return Object.assign<CoffeeTreeReport, Partial<CoffeeTreeReport> | undefined>(
      {
        photoPath: '',
        createdAt: Date.now(),
        notes: '',
        height: 100,
        individualFertilization: false,
        budding: BuddingConditions.NotYet,
        beanYield: YieldConditions.NotYet,
      },
      params,
    );
  }
}
