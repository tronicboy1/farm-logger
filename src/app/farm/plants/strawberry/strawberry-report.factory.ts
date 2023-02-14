import { PlantReportFactory } from '../plant-report.factory';
import { StrawberryFlowering, StrawberryReport } from './strawberry.model';

export class StrawberryReportFactory extends PlantReportFactory {
  override create(params?: Partial<StrawberryReport> | undefined): StrawberryReport {
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
