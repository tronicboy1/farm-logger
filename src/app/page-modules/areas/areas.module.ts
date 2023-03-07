import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreasRoutingModule } from './areas-routing.module';
import { AreasComponent } from './areas.component';
import { NewAreaFormComponent } from './new-area-form/new-area-form.component';
import { AreaComponent } from './area/area.component';
import { FertilizerComponent } from './area/fertilizer/fertilizer.component';
import { CropdustComponent } from './area/cropdust/cropdust.component';
import { AreaIndexComponent } from './area/index/index.component';
import { NewFertilizationFormComponent } from './area/fertilizer/new-fertilization-form/new-fertilization-form.component';
import { NewCropdustFormComponent } from './area/cropdust/new-cropdust-form/new-cropdust-form.component';
import { DeleteAreaFormComponent } from './delete-area-form/delete-area-form.component';
import { EditAreaFormComponent } from './area/index/edit-area-form/edit-area-form.component';
import { NewAreaModalComponent } from './new-area-modal/new-area-modal.component';
import { DeleteAreaModalComponent } from './delete-area-modal/delete-area-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { FarmModule } from '@farm/farm.module';
import { NgxGeolocationModule } from '@tronicboy/ngx-geolocation';

@NgModule({
  declarations: [
    AreasComponent,
    NewAreaFormComponent,
    AreaComponent,
    FertilizerComponent,
    CropdustComponent,
    AreaIndexComponent,
    NewFertilizationFormComponent,
    NewCropdustFormComponent,
    DeleteAreaFormComponent,
    EditAreaFormComponent,
    NewAreaModalComponent,
    DeleteAreaModalComponent,
  ],
  imports: [
    CommonModule,
    AreasRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    NgxVisibleAutofocusModule,
    NgxBaseComponentsModule,
    NgxObservableDirectiveModule.forChild(),
    FarmModule,
    NgxGeolocationModule,
  ],
  /** Adding custom Elements Schema allows use of custom tags i.e. Web Components. */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AreasModule {}
