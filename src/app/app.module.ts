import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
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
import { NgxBaseComponentsModule } from '@tronicboy/ngx-base-components';
import { HttpClientModule } from '@angular/common/http';
import { NgxFirebaseUserNavbarModule } from '@tronicboy/ngx-firebase-user-navbar';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(jaLocale);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    FarmModule, // can delete
    ComponentsModule,
    NgxFirebaseUserNavbarModule,
    NgxObservableDirectiveModule.forRoot({ rootMargin: '20px' }),
    NgxFirebaseUserPlatformModule.forRoot({
      firebaseConfig,
      production: environment.production,
      appCheck: {
        provider: new ReCaptchaV3Provider('6Lffd0wjAAAAAN7ghKd7xyOOyqcmthVEOecCx_g5'),
        isTokenAutoRefreshEnabled: true,
      },
      emulators: environment.emulatorPorts,
      analytics: true,
    }),
    NgxBaseComponentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ja-JP' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
