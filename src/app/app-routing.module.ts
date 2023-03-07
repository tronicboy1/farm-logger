import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoadStrawberryGuard } from '@farm/plants/strawberry/can-load-strawberry.guard';
import { AuthComponent } from '@pages/auth/auth.component';
import { FarmComponent } from '@pages/farm/farm.component';
import { ManageComponent } from '@pages/farm/manage/manage.component';
import { HomeComponent } from '@pages/home/home.component';
import { NewFarmModalComponent } from '@pages/home/new-farm-modal/new-farm-modal.component';
import { PageNotFoundComponent } from '@pages/page-not-found/page-not-found.component';
import { AuthGuard } from 'ngx-firebase-user-platform';
import { MemberGuard } from './farm/member.guard';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'new', component: NewFarmModalComponent }],
  },
  {
    path: 'farms/:farmId',
    component: FarmComponent,
    canActivate: [AuthGuard, MemberGuard],
    children: [
      { path: 'manage', component: ManageComponent, data: { title: '農園管理' } },
      { path: 'areas', loadChildren: () => import('./page-modules/areas/areas.module').then((m) => m.AreasModule) },
      {
        path: 'environment',
        loadChildren: () => import('./page-modules/environment/environment.module').then((m) => m.EnvironmentModule),
      },
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
