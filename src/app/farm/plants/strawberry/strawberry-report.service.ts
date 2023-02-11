import { Injectable } from '@angular/core';
import { PlantReportService } from '../plant-report.service';
import { StrawberryReport } from './strawberry.model';

@Injectable({
  providedIn: 'root',
})
export class StrawberryReportService extends PlantReportService<StrawberryReport> {
  protected getBasePath(farmId: string, areaId: string, plantId: string) {
    return `farms/${farmId}/areas/${areaId}/strawberries/${plantId}/reports`;
  }
}
