import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrawberriesComponent } from './strawberries/strawberries.component';
import { NewStrawberryReportModalComponent } from './strawberries/strawberry/new-strawberry-report-modal/new-strawberry-report-modal.component';
import { StrawberryComponent } from './strawberries/strawberry/strawberry.component';

const routes: Routes = [
  { path: '', component: StrawberriesComponent },
  {
    path: ':plantId',
    component: StrawberryComponent,
    children: [
      {
        path: 'new-report',
        outlet: 'modals',
        component: NewStrawberryReportModalComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrawberryPagesRoutingModule {}
