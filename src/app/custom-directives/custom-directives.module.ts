import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ObservableDirective } from "./observable.directive";
import { SubmitOnModifierEnterDirective } from './submit-on-modifier-enter.directive';

@NgModule({
  declarations: [ObservableDirective, SubmitOnModifierEnterDirective],
  exports: [ObservableDirective, SubmitOnModifierEnterDirective],
  imports: [CommonModule],
})
export class CustomDirectivesModule {}
