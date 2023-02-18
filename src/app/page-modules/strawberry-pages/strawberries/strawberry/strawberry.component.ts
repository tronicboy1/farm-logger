import { Component, inject } from '@angular/core';
import { StrawberryReportService } from '@farm/plants/strawberry/strawberry-report.service';
import { StrawberryService } from '@farm/plants/strawberry/strawberry.service';
import { PlantComponent } from '@plant-pages/plants/plant/plant.component';
import { shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-strawberry',
  templateUrl: './strawberry.component.html',
  styleUrls: ['./strawberry.component.css', '../../../plant-pages/plants/plant/plant.component.css'],
})
export class StrawberryComponent extends PlantComponent {
  protected plantService = inject(StrawberryService);
  protected plantReportService = inject(StrawberryReportService);
  reports = this.getFarmIdAreaIdAndPlantId().pipe(
    switchMap(([farmId, areaId, plantId]) => this.plantReportService.watchAll(this, farmId, areaId, plantId)),
    shareReplay(1),
  );
}
