import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

import { Page1 } from '../pages/page1/page1';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// modules
import { DataModule } from '../core/data/data.module';
import { PortfolioModule } from '../portfolio/portfolio.module';

@NgModule({
  declarations: [
    MyApp,
    Page1
  ],
  imports: [
    BrowserModule,
    PortfolioModule,
    DataModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, { links: [] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1
  ],
  providers: AppProviders.getProviders()
})
export class AppModule { }
