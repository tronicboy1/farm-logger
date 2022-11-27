import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import "@web-components/loading-spinner";
import "@web-components/base-modal";
import { AccountCircleComponent } from "./account-circle/account-circle.component";
import { ChangeEmailFormComponent } from "./account-circle/change-email-form/change-email-form.component";
import { ChangeAvatarFormComponent } from "./account-circle/change-avatar-form/change-avatar-form.component";
import { AccountDetailsFormComponent } from "./account-circle/account-details-form/account-details-form.component";
import { UserModule } from "@user/user.module";
import { NavBarComponent } from './nav-bar.component';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    AccountCircleComponent,
    ChangeEmailFormComponent,
    ChangeAvatarFormComponent,
    AccountDetailsFormComponent,
    NavBarComponent,
  ],
  imports: [CommonModule, UserModule, RouterModule],
  exports: [NavBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavBarModule {}
