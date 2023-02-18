import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StrawberryReportService } from '@farm/plants/strawberry/strawberry-report.service';
import { StrawberryFactory } from '@farm/plants/strawberry/strawberry.factory';
import { StrawberryFlowering, strawberryFloweringTypes, StrawberryReport } from '@farm/plants/strawberry/strawberry.model';
import { StrawberryService } from '@farm/plants/strawberry/strawberry.service';
import { NewPlantReportFormComponent } from '@plant-pages/plants/plant/new-report-form/new-plant-report-form.component';

@Component({
  selector: 'app-new-strawberry-report-form',
  templateUrl: './new-strawberry-report-form.component.html',
  styleUrls: ['./new-strawberry-report-form.component.css', '../../../../../../styles/basic-form.css'],
})
export class NewStrawberryReportFormComponent extends NewPlantReportFormComponent {
  floweringTypes = Array.from(strawberryFloweringTypes);
  protected plantFactory = new StrawberryFactory();
  protected plantService = inject(StrawberryService);
  protected plantReportService = inject(StrawberryReportService);
  newReportForm = new FormGroup({
    notes: new FormControl('', { nonNullable: true }),
    width: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    picture: new FormControl<File | null>(null),
    individualFertilization: new FormControl(false, { nonNullable: true }),
    pollination: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
    flowering: new FormControl<StrawberryFlowering>(StrawberryFlowering.NotYet, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected createReportData(): StrawberryReport {
    const notes = this.newReportForm.controls['notes'].value.trim();
    const individualFertilization = this.newReportForm.controls['individualFertilization'].value;
    const width = this.newReportForm.controls.width.value;
    const pollination = this.newReportForm.controls.pollination.value;
    const flowering = this.newReportForm.controls.flowering.value;
    return this.plantFactory.createReport({ notes, individualFertilization, width, pollination, flowering });
  }
}
