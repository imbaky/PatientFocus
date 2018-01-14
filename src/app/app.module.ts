import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

import { IntroPage } from '../pages/intro/intro';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// modules
import { DataModule } from '../core/data/data.module';
import { ProfilePage } from '../pages/profile/profile';
import { WelcomePage } from '../pages/welcome/welcome';
import { PortfolioModule } from '../pages/portfolio/portfolio.module';


@NgModule({
    declarations: [
        MyApp,
        IntroPage,
        ProfilePage,
        WelcomePage
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
        IntroPage,
        ProfilePage,
        WelcomePage
    ],
    providers: AppProviders.getProviders()
})
export class AppModule {
}
