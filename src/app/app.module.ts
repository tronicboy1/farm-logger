import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { FarmModule } from './farm/farm.module';
import { PagesModule } from './pages/pages.module';
import jaLocale from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';
import { NgxObservableDirectiveModule } from 'ngx-observable-directive';
import { NgxFirebaseUserPlatformModule } from 'ngx-firebase-user-platform';
import { firebaseConfig } from '@custom-firebase/config';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Provider } from 'firebase/app-check';

registerLocaleData(jaLocale);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    FarmModule,
    ComponentsModule,
    NgxObservableDirectiveModule.forRoot({ rootMargin: '20px' }),
    NgxFirebaseUserPlatformModule.forRoot(
      firebaseConfig,
      environment.production,
      {
        provider: new ReCaptchaV3Provider('6Lffd0wjAAAAAN7ghKd7xyOOyqcmthVEOecCx_g5'),
        isTokenAutoRefreshEnabled: true,
      },
      environment.emulatorPorts,
    ),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ja-JP' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
