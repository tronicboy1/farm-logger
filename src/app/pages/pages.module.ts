import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth/auth.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { HomeComponent } from "./home/home.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NewFarmFormComponent } from "./home/new-farm-form/new-farm-form.component";
import { FarmComponent } from "./farm/farm.component";
import { ManageComponent } from "./farm/manage/manage.component";
import { AddMemberFormComponent } from "./farm/manage/members/add-member-form/add-member-form.component";
import { MembersComponent } from "./farm/manage/members/members.component";
import { RouterModule } from "@angular/router";
import { AreasComponent } from "./farm/areas/areas.component";
import { EnvironmentComponent } from "./farm/environment/environment.component";
import { ObservableDirective } from "./farm/environment/observable.directive";
import { NewAreaFormComponent } from "./farm/areas/new-area-form/new-area-form.component";
import { AreaComponent } from "./farm/areas/area/area.component";
import { TreesComponent } from "./farm/areas/area/trees/trees.component";
import { ComponentsModule } from "../components/components.module";

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
    ObservableDirective,
    NewAreaFormComponent,
    AreaComponent,
    TreesComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ComponentsModule],
  /** Adding custom Elements Schema allows use of custom tags i.e. Web Components. */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
