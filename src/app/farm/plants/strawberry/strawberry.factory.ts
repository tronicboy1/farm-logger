import { PlantFactory } from '../plant.factory';
import { Plant, PlantTypes } from '../plant.model';
import { StrawberryFlowering, StrawberryPlant, StrawberryReport } from './strawberry.model';

export class StrawberryFactory extends PlantFactory {
  override create(params?: Partial<StrawberryPlant> | undefined): StrawberryPlant {
    return Object.assign<StrawberryPlant, typeof params>(
      {
        regularId: 0,
        species: '',
        plantType: PlantTypes.StrawberryPlant,
        startingWidth: 0,
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
        width: 1,
        individualFertilization: false,
        flowering: StrawberryFlowering.NotYet,
        pollination: false,
      },
      params,
    );
  }
}
