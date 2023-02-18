import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrawberriesComponent } from './strawberries/strawberries.component';
import { StrawberryComponent } from './strawberries/strawberry/strawberry.component';

const routes: Routes = [
  { path: '', component: StrawberriesComponent },
  { path: ':plantId', component: StrawberryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrawberryPagesRoutingModule {}
