import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavBarModule } from "./nav-bar/nav-bar.module";
import { PagesModule } from "./pages/pages.module";
import { UserModule } from "./user-module/user.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, UserModule, PagesModule, NavBarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
