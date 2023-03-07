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
import { ComponentsModule } from '../components/components.module';
import '@web-components/base-tooltip';
import { LogViewComponent } from './farm/log-view/log-view.component';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { NgxGeolocationModule } from '@tronicboy/ngx-geolocation';
import { DeleteFarmFormComponent } from './farm/manage/delete-farm-form/delete-farm-form.component';
import { FarmModule } from '@farm/farm.module';
import { NewFarmModalComponent } from './home/new-farm-modal/new-farm-modal.component';

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
    LogViewComponent,
    DeleteFarmFormComponent,
    NewFarmModalComponent,
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
