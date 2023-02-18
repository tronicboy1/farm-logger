import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { forkJoin, map, shareReplay, switchMap } from 'rxjs';
import { PlantsComponent } from '@plant-pages/plants/plants.component';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['../../plant-pages/plants/plants.component.css', './trees.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreesComponent extends PlantsComponent implements OnInit, OnDestroy {
  protected plantService = inject(TreeService);
  protected plantReportService = inject(TreeReportService);
  readonly trees$ = this.getFarmIdAndAreaId().pipe(
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
  readonly loading$ = this.plantService.treesLoading$;
}
