import { Component, inject } from '@angular/core';
import { StrawberryReportService } from '@farm/plants/strawberry/strawberry-report.service';
import { NewPlantReportModalComponent } from '@plant-pages/plants/plant/new-plant-report-modal/new-plant-report-modal.component';
import { StrawberryComponent } from '../strawberry.component';

@Component({
  selector: 'app-new-strawberry-report-modal',
  templateUrl: './new-strawberry-report-modal.component.html',
  styleUrls: ['./new-strawberry-report-modal.component.css'],
})
export class NewStrawberryReportModalComponent extends NewPlantReportModalComponent {
  protected plantReportService = inject(StrawberryReportService);
  protected streamHostComponent = inject(StrawberryComponent);
}
