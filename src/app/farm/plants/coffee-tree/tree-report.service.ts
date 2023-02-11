import { Injectable } from '@angular/core';
import { PaginatedService } from '@farm/paginated.service.abstract';
import { PlantReportService } from '../plant-report.service';
import { CoffeeTreeReport } from './tree.model';

@Injectable({
  providedIn: 'root',
})
export class TreeReportService extends PlantReportService<CoffeeTreeReport> implements PaginatedService {
  protected getBasePath(farmId: string, areaId: string, plantId: string) {
    return `farms/${farmId}/areas/${areaId}/trees/${plantId}/reports`;
  }
}
