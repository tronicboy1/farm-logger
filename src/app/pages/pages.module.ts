import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewFarmFormComponent } from './home/new-farm-form/new-farm-form.component';
import { FarmComponent } from './farm/farm.component';
import { ManageComponent } from './farm/manage/manage.component';
import { AddMemberFormComponent } from './farm/manage/members/add-member-form/add-member-form.component';
import { MembersComponent } from './farm/manage/members/members.component';
import { RouterModule } from '@angular/router';
import { AreasComponent } from './farm/areas/areas.component';
import { EnvironmentComponent } from './farm/environment/environment.component';
import { NewAreaFormComponent } from './farm/areas/new-area-form/new-area-form.component';
import { AreaComponent } from './farm/areas/area/area.component';
import { ComponentsModule } from '../components/components.module';
import { FertilizerComponent } from './farm/areas/area/fertilizer/fertilizer.component';
import { CropdustComponent } from './farm/areas/area/cropdust/cropdust.component';
import { AreaIndexComponent } from './farm/areas/area/index/index.component';
import { NewFertilizationFormComponent } from './farm/areas/area/fertilizer/new-fertilization-form/new-fertilization-form.component';
import { NewCropdustFormComponent } from './farm/areas/area/cropdust/new-cropdust-form/new-cropdust-form.component';
import { WeatherFormComponent } from './farm/environment/weather-form/weather-form.component';
import '@web-components/base-tooltip';
import { LogViewComponent } from './farm/log-view/log-view.component';
import { DeleteAreaFormComponent } from './farm/areas/delete-area-form/delete-area-form.component';
import { EditAreaFormComponent } from './farm/areas/area/index/edit-area-form/edit-area-form.component';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { NgxGeolocationModule } from '@tronicboy/ngx-geolocation';
import { DeleteFarmFormComponent } from './farm/manage/delete-farm-form/delete-farm-form.component';
import { FarmModule } from '@farm/farm.module';
import { NewAreaModalComponent } from './farm/areas/new-area-modal/new-area-modal.component';
import { DeleteAreaModalComponent } from './farm/areas/delete-area-modal/delete-area-modal.component';

@NgModule({
  declarations: [
    AuthComponent,
    PageNotFoundComponent,
    HomeComponent,
    NewFarmFormComponent,
    FarmComponent,
    MembersComponent,
    AddMemberFormComponent,
    ManageComponent,
    AreasComponent,
    EnvironmentComponent,
    NewAreaFormComponent,
    AreaComponent,
    FertilizerComponent,
    CropdustComponent,
    AreaIndexComponent,
    NewFertilizationFormComponent,
    NewCropdustFormComponent,
    WeatherFormComponent,
    LogViewComponent,
    DeleteAreaFormComponent,
    EditAreaFormComponent,
    DeleteFarmFormComponent,
    NewAreaModalComponent,
    DeleteAreaModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ComponentsModule,
    NgxVisibleAutofocusModule,
    NgxObservableDirectiveModule,
    NgxBaseComponentsModule,
    NgxGeolocationModule,
    FarmModule,
  ],
  /** Adding custom Elements Schema allows use of custom tags i.e. Web Components. */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
