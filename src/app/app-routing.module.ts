import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@pages/auth/auth.component';
import { AreaComponent } from '@pages/farm/areas/area/area.component';
import { CropdustComponent } from '@pages/farm/areas/area/cropdust/cropdust.component';
import { FertilizerComponent } from '@pages/farm/areas/area/fertilizer/fertilizer.component';
import { AreaIndexComponent } from '@pages/farm/areas/area/index/index.component';
import { AreasComponent } from '@pages/farm/areas/areas.component';
import { EnvironmentComponent } from '@pages/farm/environment/environment.component';
import { FarmComponent } from '@pages/farm/farm.component';
import { ManageComponent } from '@pages/farm/manage/manage.component';
import { HomeComponent } from '@pages/home/home.component';
import { PageNotFoundComponent } from '@pages/page-not-found/page-not-found.component';
import { AuthGuard } from 'ngx-firebase-user-platform';
import { MemberGuard } from './farm/member.guard';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'farms/:farmId',
    component: FarmComponent,
    canActivate: [AuthGuard, MemberGuard],
    children: [
      { path: 'manage', component: ManageComponent, data: { title: '農園管理' } },
      { path: 'areas', component: AreasComponent, data: { title: '区域一覧' } },
      {
        path: 'areas/:areaId',
        component: AreaComponent,
        children: [
          {
            path: 'trees',
            loadChildren: () =>
              import('./pages/farm/areas/area/tree-pages/tree-pages.module').then((m) => m.TreePagesModule),
          },
          { path: 'fertilizer', component: FertilizerComponent },
          { path: 'cropdust', component: CropdustComponent },
          { path: '', component: AreaIndexComponent, pathMatch: 'full' },
        ],
      },
      { path: 'environment', component: EnvironmentComponent },
      { path: '', redirectTo: 'areas', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
