import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LogModule } from '../log/log.module';
import { NgxFirebaseUserPlatformModule } from 'ngx-firebase-user-platform';
import { TreeReportBuddingPipe } from './plants/coffee-tree/tree-report-budding.pipe';
import { TreeReportYieldPipe } from './plants/coffee-tree/tree-report-yield.pipe';
import { FertilizationTypePipe } from './fertilization-type.pipe';

@NgModule({
  declarations: [TreeReportBuddingPipe, TreeReportYieldPipe, FertilizationTypePipe],
  exports: [TreeReportBuddingPipe, TreeReportYieldPipe, FertilizationTypePipe],
  imports: [CommonModule, HttpClientModule, LogModule, NgxFirebaseUserPlatformModule],
})
export class FarmModule {}
