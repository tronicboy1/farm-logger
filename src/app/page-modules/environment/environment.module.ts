import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironmentRoutingModule } from './environment-routing.module';
import { EnvironmentComponent } from './environment.component';
import { WeatherFormComponent } from './weather-form/weather-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { EnvironmentRecordService } from './environment-record.service';

@NgModule({
  declarations: [EnvironmentComponent, WeatherFormComponent],
  //providers: [EnvironmentRecordService],
  imports: [
    CommonModule,
    EnvironmentRoutingModule,
    ReactiveFormsModule,
    NgxVisibleAutofocusModule,
    NgxBaseComponentsModule,
    NgxObservableDirectiveModule.forChild(),
  ],
})
export class EnvironmentModule {}
