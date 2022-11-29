import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth/auth.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { HomeComponent } from "./home/home.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NewFarmFormComponent } from "./home/new-farm-form/new-farm-form.component";
import { FarmComponent } from './farm/farm.component';
import { MembersComponent } from './farm/members/members.component';

@NgModule({
  declarations: [AuthComponent, PageNotFoundComponent, HomeComponent, NewFarmFormComponent, FarmComponent, MembersComponent],
  imports: [CommonModule, ReactiveFormsModule],
  /** Adding custom Elements Schema allows use of custom tags i.e. Web Components. */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
