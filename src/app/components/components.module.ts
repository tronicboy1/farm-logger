import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { NavLocationComponent } from './nav-location/nav-location.component';

@NgModule({
  declarations: [NavLocationComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxBaseComponentsModule],
  exports: [NavLocationComponent],
})
export class ComponentsModule {}
