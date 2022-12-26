import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservableDirective } from './observable.directive';
import { SubmitOnModifierEnterDirective } from './submit-on-modifier-enter.directive';
import { ObserverChildDirective } from './observer-child.directive';
import { CloseOnEscDirective } from './close-on-esc.directive';

@NgModule({
  declarations: [ObservableDirective, SubmitOnModifierEnterDirective, ObserverChildDirective, CloseOnEscDirective],
  exports: [ObservableDirective, SubmitOnModifierEnterDirective, ObserverChildDirective, CloseOnEscDirective],
  imports: [CommonModule],
})
export class CustomDirectivesModule {}
