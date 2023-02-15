import { Plant, PlantReport } from './plant.model';

export abstract class PlantFactoryAbstract {
  abstract create(params?: Partial<Plant>): Plant;

  abstract createReport(params?: Partial<PlantReport>): PlantReport;
}
