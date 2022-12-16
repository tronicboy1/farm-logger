import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '@user/user.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserModule, HttpClientModule],
})
export class FarmModule {}
