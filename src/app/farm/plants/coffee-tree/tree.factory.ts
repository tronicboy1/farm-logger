import { PlantFactoryAbstract } from '../plant.factory.abstract';
import { PlantTypes } from '../plant.model';
import { BuddingConditions, CoffeeTree, CoffeeTreeReport, YieldConditions } from './tree.model';

export class CoffeeTreeFactory implements PlantFactoryAbstract {
  create(params?: Partial<CoffeeTree>): CoffeeTree {
    return Object.assign<CoffeeTree, Partial<CoffeeTree> | undefined>(
      {
        regularId: NaN,
        startHeight: 100,
        species: $localize`Arabica`,
        plantType: PlantTypes.CoffeeTree,
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
