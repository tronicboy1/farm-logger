import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrawberryPagesRoutingModule } from './strawberry-pages-routing.module';
import { StrawberriesComponent } from './strawberries/strawberries.component';
import { StrawberryComponent } from './strawberries/strawberry/strawberry.component';
import { NewStrawberryFormComponent } from './strawberries/new-strawberry-form/new-strawberry-form.component';
import { EditStrawberryFormComponent } from './strawberries/strawberry/edit-strawberry-form/edit-strawberry-form.component';
import { NewStrawberryReportFormComponent } from './strawberries/strawberry/new-strawberry-report-form/new-strawberry-report-form.component';
import { PlantPagesModule } from '@plant-pages/plants-module.module';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';

@NgModule({
  declarations: [
    StrawberriesComponent,
    StrawberryComponent,
    NewStrawberryFormComponent,
    EditStrawberryFormComponent,
    NewStrawberryReportFormComponent,
  ],
  imports: [
    CommonModule,
    StrawberryPagesRoutingModule,
    PlantPagesModule,
    NgxBaseComponentsModule,
    ReactiveFormsModule,
    NgxObservableDirectiveModule.forChild(),
  ],
})
export class StrawberryPagesModule {}
