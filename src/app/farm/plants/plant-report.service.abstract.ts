import { PaginatedService } from '@farm/paginated.service.abstract';
import { Observable } from 'rxjs';
import { PlantReport, PlantReportWithId } from './plant.model';

export abstract class PlantReportServiceAbstract extends PaginatedService<PlantReportWithId[]> {
  abstract addReport(farmId: string, areaId: string, plantId: string, reportData: PlantReport): Promise<any>;

  abstract watchAll(farmId: string, areaId: string, plantId: string): Observable<PlantReportWithId[]>;

  /**
   * Used for deleting all photos on area delete.
   */
  abstract getAllReports(farmId: string, areaId: string, plantId: string): Observable<PlantReport[]>;

  abstract getLatestReport(farmId: string, areaId: string, plantId: string): Observable<PlantReport | undefined>;

  abstract getLatestIndividualFertilization(
    farmId: string,
    areaId: string,
    plantId: string,
  ): Observable<PlantReport | undefined>;

  abstract removeReport(farmId: string, areaId: string, plantId: string, reportId: string): Promise<void>;
}
