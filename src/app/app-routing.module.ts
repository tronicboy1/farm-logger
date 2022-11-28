import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "@pages/auth/auth.component";
import { FarmComponent } from "@pages/farm/farm.component";
import { HomeComponent } from "@pages/home/home.component";
import { PageNotFoundComponent } from "@pages/page-not-found/page-not-found.component";
import { AuthGuard } from "@user/auth.guard";

const routes: Routes = [
  { path: "auth", component: AuthComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "farms/:farmId", component: FarmComponent, canActivate: [AuthGuard], children: [] },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
