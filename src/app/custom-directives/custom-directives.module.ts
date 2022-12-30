import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitOnModifierEnterDirective } from './submit-on-modifier-enter.directive';
import { ObserverChildDirective } from './observer-child.directive';
import { CloseOnEscDirective } from './close-on-esc.directive';

@NgModule({
  declarations: [SubmitOnModifierEnterDirective, ObserverChildDirective, CloseOnEscDirective],
  exports: [SubmitOnModifierEnterDirective, ObserverChildDirective, CloseOnEscDirective],
  imports: [CommonModule],
})
export class CustomDirectivesModule {}
