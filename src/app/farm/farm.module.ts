import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LogModule } from '../log/log.module';
import { NgxFirebaseUserPlatformModule } from 'ngx-firebase-user-platform';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, LogModule, NgxFirebaseUserPlatformModule],
})
export class FarmModule {}
