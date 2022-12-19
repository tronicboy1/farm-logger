import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservableDirective } from './observable.directive';
import { SubmitOnModifierEnterDirective } from './submit-on-modifier-enter.directive';
import { ObserverChildDirective } from './observer-child.directive';

@NgModule({
  declarations: [ObservableDirective, SubmitOnModifierEnterDirective, ObserverChildDirective],
  exports: [ObservableDirective, SubmitOnModifierEnterDirective, ObserverChildDirective],
  imports: [CommonModule],
})
export class CustomDirectivesModule {}
