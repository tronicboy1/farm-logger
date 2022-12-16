import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { FarmModule } from './farm/farm.module';
import { PagesModule } from './pages/pages.module';
import { UserModule } from './user-module/user.module';
import jaLocale from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';

registerLocaleData(jaLocale);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, UserModule, PagesModule, FarmModule, ComponentsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'ja-JP' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
