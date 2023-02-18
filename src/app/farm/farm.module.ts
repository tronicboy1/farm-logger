import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogModule } from '../log/log.module';
import { NgxFirebaseUserPlatformModule } from 'ngx-firebase-user-platform';
import { TreeReportBuddingPipe } from './plants/coffee-tree/tree-report-budding.pipe';
import { TreeReportYieldPipe } from './plants/coffee-tree/tree-report-yield.pipe';
import { FertilizationTypePipe } from './fertilization-type.pipe';

@NgModule({
  declarations: [TreeReportBuddingPipe, TreeReportYieldPipe, FertilizationTypePipe],
  exports: [TreeReportBuddingPipe, TreeReportYieldPipe, FertilizationTypePipe],
  imports: [CommonModule, LogModule, NgxFirebaseUserPlatformModule],
})
export class FarmModule {}
