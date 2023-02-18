import { Component, inject } from '@angular/core';
import { StrawberryReportService } from '@farm/plants/strawberry/strawberry-report.service';
import { StrawberryService } from '@farm/plants/strawberry/strawberry.service';
import { PlantsComponent } from '@plant-pages/plants/plants.component';
import { forkJoin, map, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-strawberries',
  templateUrl: './strawberries.component.html',
  styleUrls: ['./strawberries.component.css', '../../plant-pages/plants/plants.component.css'],
})
export class StrawberriesComponent extends PlantsComponent {
  protected plantService = inject(StrawberryService);
  protected plantReportService = inject(StrawberryReportService);
  strawberries$ = this.getFarmIdAndAreaId().pipe(
    switchMap(([farmId, areaId]) =>
      this.plantService.watchAll(this, farmId, areaId).pipe(
        switchMap((plants) =>
          forkJoin(
            plants.map((plant) =>
              forkJoin([
                this.plantReportService.getLatestReport(farmId, areaId, plant.id),
                this.plantReportService.getLatestIndividualFertilization(farmId, areaId, plant.id),
              ]).pipe(
                map(([report, latestIndividualFertilization]) => ({
                  latestIndividualFertilization,
                  report,
                  ...plant,
                })),
              ),
            ),
          ),
        ),
      ),
    ),
    shareReplay(1),
  );
}
