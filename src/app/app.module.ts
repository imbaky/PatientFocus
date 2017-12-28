import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

import { Intro } from '../pages/intro/intro';
import { Documents } from '../pages/documents/documents';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// modules
import { DataModule } from '../core/data/data.module';
import { Profile } from '../pages/profile/profile.component';
import { Welcome } from '../pages/welcome/welcome';
import { PortfolioModule } from '../portfolio/portfolio.module';


@NgModule({
    declarations: [
        MyApp,
        Intro,
        Documents,
        Profile,
        Welcome
    ],
    imports: [
        BrowserModule,
        PortfolioModule,
        DataModule.forRoot(),
        IonicModule.forRoot(MyApp, {}, {links: []})
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Intro,
        Documents,
        Profile,
        Welcome
    ],
    providers: AppProviders.getProviders()
})
export class AppModule {
}
