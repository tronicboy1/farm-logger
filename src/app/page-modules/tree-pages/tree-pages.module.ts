import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { NgxVisibleAutofocusModule } from 'ngx-visible-autofocus';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { FarmModule } from '@farm/farm.module';
import { TreesComponent } from './trees/trees.component';
import { TreeComponent } from './trees/tree/tree.component';
import { NewTreeFormComponent } from './trees/new-tree-form/new-tree-form.component';
import { EditTreeFormComponent } from './trees/tree/edit-tree-form/edit-tree-form.component';
import { NewReportFormComponent } from './trees/tree/new-report-form/new-report-form.component';
import { PlantPagesModule } from '@plant-pages/plants-module.module';
import { TreePagesRoutingModule } from './tree-pages-routing.module';
import { NewTreeReportModalComponent } from './trees/tree/new-tree-report-modal/new-tree-report-modal.component';

@NgModule({
  declarations: [TreesComponent, TreeComponent, NewTreeFormComponent, EditTreeFormComponent, NewReportFormComponent, NewTreeReportModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TreePagesRoutingModule,
    ComponentsModule,
    NgxVisibleAutofocusModule,
    NgxObservableDirectiveModule.forChild(),
    NgxBaseComponentsModule,
    FarmModule,
    PlantPagesModule,
  ],
})
export class TreePagesModule {}
