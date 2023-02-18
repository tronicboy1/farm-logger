import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '@components/components.module';
import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { FarmModule } from '@farm/farm.module';
import { TreesComponent } from './trees/trees.component';
import { TreeComponent } from './trees/tree/tree.component';
import { NewTreeFormComponent } from './trees/new-tree-form/new-tree-form.component';
import { EditTreeFormComponent } from './trees/tree/edit-tree-form/edit-tree-form.component';
import { NewReportFormComponent } from './trees/tree/new-report-form/new-report-form.component';
import { PlantPagesModule } from '../plants-pages-module/plants-module.module';
import { TreePagesRoutingModule } from './tree-pages-routing.module';

@NgModule({
  declarations: [TreesComponent, TreeComponent, NewTreeFormComponent, EditTreeFormComponent, NewReportFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TreePagesRoutingModule,
    ComponentsModule,
    CustomDirectivesModule,
    NgxVisibleAutofocusModule,
    NgxObservableDirectiveModule.forChild(),
    NgxBaseComponentsModule,
    FarmModule,
    PlantPagesModule,
  ],
})
export class TreePagesModule {}
