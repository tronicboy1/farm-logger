import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LocationComponent } from "./location/location.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AccountCircleComponent } from "./nav-bar/account-circle/account-circle.component";
import { ChangeAvatarFormComponent } from "./nav-bar/account-circle/change-avatar-form/change-avatar-form.component";
import { AccountDetailsFormComponent } from "./nav-bar/account-circle/account-details-form/account-details-form.component";
import { ChangeEmailFormComponent } from "./nav-bar/account-circle/change-email-form/change-email-form.component";
import "@web-components/base-modal";
import { RouterModule } from "@angular/router";
import { LocationFormComponent } from "./location/location-form/location-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NavLocationComponent } from "./nav-bar/nav-location/nav-location.component";

@NgModule({
  declarations: [
    LocationComponent,
    AccountCircleComponent,
    ChangeAvatarFormComponent,
    AccountDetailsFormComponent,
    ChangeEmailFormComponent,
    NavBarComponent,
    LocationFormComponent,
    NavLocationComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [LocationComponent, NavBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
