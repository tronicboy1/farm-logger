import { Component, inject } from '@angular/core';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';
import { NewPlantReportModalComponent } from '@plant-pages/plants/plant/new-plant-report-modal/new-plant-report-modal.component';
import { TreeComponent } from '../tree.component';

@Component({
  selector: 'app-new-tree-report-modal',
  templateUrl: './new-tree-report-modal.component.html',
  styleUrls: ['./new-tree-report-modal.component.css'],
})
export class NewTreeReportModalComponent extends NewPlantReportModalComponent {
  protected plantReportService = inject(TreeReportService);
  protected streamHostComponent = inject(TreeComponent);
}
