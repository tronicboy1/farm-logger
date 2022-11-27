import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "@pages/auth/auth.component";
import { HomeComponent } from "@pages/home/home.component";
import { PageNotFoundComponent } from "@pages/page-not-found/page-not-found.component";
import { AuthGuard } from "@user/auth.guard";

const routes: Routes = [
  { path: "auth", component: AuthComponent, data: { animation: "AuthComponent" } },
  { path: "", component: HomeComponent, canActivate: [AuthGuard], pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
