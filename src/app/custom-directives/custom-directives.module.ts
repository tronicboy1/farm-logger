import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ObservableDirective } from "./observable.directive";

@NgModule({
  declarations: [ObservableDirective],
  exports: [ObservableDirective],
  imports: [CommonModule],
})
export class CustomDirectivesModule {}
