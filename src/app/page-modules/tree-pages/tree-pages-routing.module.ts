import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeComponent } from './trees/tree/tree.component';
import { TreesComponent } from './trees/trees.component';

const routes: Routes = [
  { path: '', component: TreesComponent },
  { path: ':plantId', component: TreeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreePagesRoutingModule {}
