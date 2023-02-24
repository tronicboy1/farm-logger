import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '@components/components.module';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { PlantsComponent } from './plants/plants.component';
import { PlantComponent } from './plants/plant/plant.component';
import { NewPlantFormComponent } from './plants/new-plant-form/new-plant-form.component';
import { EditPlantFormComponent } from './plants/plant/edit-plant-form/edit-plant-form.component';
import { NewPlantReportFormComponent } from './plants/plant/new-report-form/new-plant-report-form.component';
import { FarmModule } from '@farm/farm.module';
import { NewPlantReportModalComponent } from './plants/plant/new-plant-report-modal/new-plant-report-modal.component';

@NgModule({
  declarations: [
    PlantsComponent,
    PlantComponent,
    NewPlantFormComponent,
    EditPlantFormComponent,
    NewPlantReportFormComponent,
    NewPlantReportModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ComponentsModule,
    NgxVisibleAutofocusModule,
    NgxBaseComponentsModule,
    NgxObservableDirectiveModule.forChild(),
    FarmModule,
  ],
})
export class PlantPagesModule {}
