import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTreeReportModalComponent } from './trees/tree/new-tree-report-modal/new-tree-report-modal.component';
import { TreeComponent } from './trees/tree/tree.component';
import { TreesComponent } from './trees/trees.component';

const routes: Routes = [
  { path: '', component: TreesComponent },
  {
    path: ':plantId',
    component: TreeComponent,
    children: [{ path: 'new-report', outlet: 'modals', component: NewTreeReportModalComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreePagesRoutingModule {}
