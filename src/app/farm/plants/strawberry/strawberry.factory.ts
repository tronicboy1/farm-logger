import { PlantFactory } from '../plant.factory';
import { Plant, PlantTypes } from '../plant.model';
import { StrawberryFlowering, StrawberryPlant, StrawberryReport } from './strawberry.model';

export class StrawberryFactory extends PlantFactory {
  override create(params?: Partial<StrawberryPlant> | undefined): StrawberryPlant {
    return Object.assign<Plant, typeof params>(
      {
        regularId: 0,
        species: '',
        plantType: PlantTypes.StrawberryPlant,
      },
      params,
    );
  }

  override createReport(params?: Partial<StrawberryReport> | undefined): StrawberryReport {
    return Object.assign<StrawberryReport, typeof params>(
      {
        photoPath: '',
        createdAt: Date.now(),
        notes: '',
        height: 10,
        individualFertilization: false,
        flowering: StrawberryFlowering.NotYet,
        pollination: false,
      },
      params,
    );
  }
}
