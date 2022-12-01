import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LocationComponent } from "./location/location.component";
import { NavBarModule } from "./nav-bar/nav-bar.module";
import { NavBarComponent } from "./nav-bar/nav-bar.component";

@NgModule({
  declarations: [LocationComponent],
  imports: [CommonModule, NavBarModule],
  exports: [LocationComponent, NavBarComponent]
})
export class ComponentsModule {}
