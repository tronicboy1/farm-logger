import { PlantFactoryAbstract } from './plant.factory.abstract';
import { Plant, PlantReport, PlantTypes } from './plant.model';

export class PlantFactory implements PlantFactoryAbstract {
  create(params?: Partial<Plant> | undefined): Plant {
    return Object.assign<Plant, typeof params>(
      {
        regularId: 0,
        species: '',
        plantType: PlantTypes.Plant,
      },
      params,
    );
  }

  createReport(params?: Partial<PlantReport>): PlantReport {
    return Object.assign<PlantReport, typeof params>(
      {
        photoPath: '',
        createdAt: Date.now(),
        notes: '',
        individualFertilization: false,
      },
      params,
    );
  }
}
