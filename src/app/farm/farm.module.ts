import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '@user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { LogModule } from '../log/log.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserModule, HttpClientModule, LogModule],
})
export class FarmModule {}
