import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "@pages/auth/auth.component";
import { AreasComponent } from "@pages/farm/areas/areas.component";
import { EnvironmentComponent } from "@pages/farm/environment/environment.component";
import { FarmComponent } from "@pages/farm/farm.component";
import { ManageComponent } from "@pages/farm/manage/manage.component";
import { HomeComponent } from "@pages/home/home.component";
import { PageNotFoundComponent } from "@pages/page-not-found/page-not-found.component";
import { AuthGuard } from "@user/auth.guard";
import { MemberGuard } from "./farm/member.guard";

const routes: Routes = [
  { path: "auth", component: AuthComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "farms/:farmId",
    component: FarmComponent,
    canActivate: [AuthGuard, MemberGuard],
    children: [
      { path: "manage", component: ManageComponent },
      { path: "areas", component: AreasComponent },
      { path: "environment", component: EnvironmentComponent },
      { path: "", redirectTo: "manage", pathMatch: "full" },
    ],
  },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
