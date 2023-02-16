import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { shareReplay, switchMap } from 'rxjs';
import { PlantComponent } from '../../plants/plant/plant.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent extends PlantComponent {
  protected plantService = inject(TreeService);
  protected plantReportService = inject(TreeReportService);
  readonly addingReport$ = this.plantReportService.addingReport$;

  readonly tree = this.getFarmIdAreaIdAndPlantId().pipe(
    switchMap(([farmId, areaId, treeId]) => this.plantService.watchOne(farmId, areaId, treeId)),
  );
  readonly reports = this.getFarmIdAreaIdAndPlantId().pipe(
    switchMap(([farmId, areaId, treeId]) => this.plantReportService.watchAll(this, farmId, areaId, treeId)),
    shareReplay(1),
  );
}
