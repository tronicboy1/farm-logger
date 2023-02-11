import { Plant, PlantReport } from './plant.model';

export abstract class PlantFactory {
  abstract create(params?: Partial<Plant>): Plant;

  abstract createReport(params?: Partial<PlantReport>): PlantReport;
}
