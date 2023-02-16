import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BuddingConditions,
  buddingConditionsText,
  CoffeeTreeReport,
  YieldConditions,
  yieldConditionsText,
} from '@farm/plants/coffee-tree/tree.model';
import { first, mergeMap } from 'rxjs';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';
import { NewPlantReportFormComponent } from '../../../plants/plant/new-report-form/new-plant-report-form.component';
import { CoffeeTreeFactory } from '@farm/plants/coffee-tree/tree.factory';

type SelectOptions<T> = { value: T; name: string }[];

@Component({
  selector: 'app-new-report-form',
  templateUrl: './new-report-form.component.html',
  styleUrls: ['./new-report-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportFormComponent extends NewPlantReportFormComponent implements OnInit {
  protected plantFactory = new CoffeeTreeFactory();
  protected plantService = inject(TreeService);
  protected plantReportService = inject(TreeReportService);
  buddingOptions: SelectOptions<BuddingConditions> = Array.from(buddingConditionsText.entries()).map(
    ([value, name]) => ({ value, name }),
  );
  yieldOptions: SelectOptions<YieldConditions> = Array.from(yieldConditionsText.entries()).map(([value, name]) => ({
    value,
    name,
  }));
  newReportForm = new FormGroup({
    notes: new FormControl('', { nonNullable: true }),
    height: new FormControl(100, { nonNullable: true, validators: [Validators.required] }),
    budding: new FormControl<BuddingConditions>(BuddingConditions.NotYet, { nonNullable: true }),
    beanYield: new FormControl<YieldConditions>(YieldConditions.NotYet, { nonNullable: true }),
    picture: new FormControl<File | null>(null),
    individualFertilization: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    // Load last recorded height to make input of just pictures easier
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, treeId]) => this.plantReportService.getLatestReport(farmId, areaId, treeId)),
        first(),
      )
      .subscribe((report) => {
        this.newReportForm.controls.height.setValue(report?.height ?? 100);
        if (typeof report?.beanYield !== 'number' || typeof report.budding !== 'number') return; // Do not get default values for old data
        this.newReportForm.controls.budding.setValue(report.budding);
        this.newReportForm.controls.beanYield.setValue(report.beanYield);
      });
  }

  protected createReportData(): CoffeeTreeReport {
    const notes = this.newReportForm.controls.notes.value.trim();
    const height = this.newReportForm.controls.height.value;
    const individualFertilization = this.newReportForm.controls.individualFertilization.value;
    const budding = this.newReportForm.controls.budding.value;
    const beanYield = this.newReportForm.controls.beanYield.value;
    return this.plantFactory.createReport({ notes, height, individualFertilization, budding, beanYield });
  }
}
