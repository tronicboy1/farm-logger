import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantReportServiceImplementation } from '@farm/plants/plant-report.service';
import { PlantComponent } from '../plant.component';

@Component({
  selector: 'app-new-plant-report-modal',
  templateUrl: './new-plant-report-modal.component.html',
  styleUrls: ['./new-plant-report-modal.component.css'],
})
export class NewPlantReportModalComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected plantReportService = inject(PlantReportServiceImplementation);
  /** The component the WeakMap key is assigned to */
  protected streamHostComponent = inject(PlantComponent, { optional: true });

  handleModalClose() {
    this.router.navigate([{ outlets: { modals: null } }], {
      queryParamsHandling: 'preserve',
      relativeTo: this.route.parent,
    });
  }

  handleNewReportSubmission() {
    this.handleModalClose();
    if (!this.streamHostComponent) throw ReferenceError('Report stream host reference component not found!');
    this.plantReportService.clearPaginationCache(this.streamHostComponent);
  }
}
