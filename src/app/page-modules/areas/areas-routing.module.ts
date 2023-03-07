import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoadStrawberryGuard } from '@farm/plants/strawberry/can-load-strawberry.guard';
import { AreaComponent } from './area/area.component';
import { CropdustComponent } from './area/cropdust/cropdust.component';
import { FertilizerComponent } from './area/fertilizer/fertilizer.component';
import { AreaIndexComponent } from './area/index/index.component';
import { AreasComponent } from './areas.component';
import { DeleteAreaModalComponent } from './delete-area-modal/delete-area-modal.component';
import { NewAreaModalComponent } from './new-area-modal/new-area-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AreasComponent,
    data: { title: '区域一覧' },
    children: [
      { path: 'new', outlet: 'modals', component: NewAreaModalComponent },
      { path: 'delete', outlet: 'modals', component: DeleteAreaModalComponent },
    ],
  },
  {
    path: ':areaId',
    component: AreaComponent,
    children: [
      {
        path: 'trees',
        loadChildren: () => import('../tree-pages/tree-pages.module').then((m) => m.TreePagesModule),
      },
      {
        path: 'strawberries',
        loadChildren: () => import('../strawberry-pages/strawberry-pages.module').then((m) => m.StrawberryPagesModule),
        canActivate: [CanLoadStrawberryGuard],
      },
      { path: 'fertilizer', component: FertilizerComponent },
      { path: 'cropdust', component: CropdustComponent },
      { path: '', component: AreaIndexComponent, pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreasRoutingModule {}
