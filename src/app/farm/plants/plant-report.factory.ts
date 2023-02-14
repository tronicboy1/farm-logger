import { PlantReport } from './plant.model';

export class PlantReportFactory {
  create(params?: Partial<PlantReport>): PlantReport {
    return Object.assign<PlantReport, typeof params>(
      {
        photoPath: '',
        createdAt: Date.now(),
        notes: '',
        height: 10,
        individualFertilization: false,
      },
      params,
    );
  }
}
