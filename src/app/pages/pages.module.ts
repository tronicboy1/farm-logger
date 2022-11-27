import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth/auth.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [AuthComponent, PageNotFoundComponent, HomeComponent],
  imports: [CommonModule],
  /** Adding custom Elements Schema allows use of custom tags i.e. Web Components. */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
