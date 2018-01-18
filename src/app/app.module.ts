import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// modules
import { DataModule } from '../core/data/data.module';
import { ProfilePage } from '../pages/profile/profile';
import { WelcomePage } from '../pages/welcome/welcome';
import { PortfolioModule } from '../pages/portfolio/portfolio.module';
import { DiaryModule } from '../pages/diary/diary.module';
import { RemindersModule } from '../reminders/reminders.module';
import { ProfileInfoPage } from "../pages/profile-info/profile-info";



@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        WelcomePage,
        ProfileInfoPage
    ],
    imports: [
        BrowserModule,
        PortfolioModule,
        RemindersModule,
        DiaryModule,
        DataModule.forRoot(),
        IonicModule.forRoot(MyApp, {}, {links: []})
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ProfilePage,
        WelcomePage,
        ProfileInfoPage,
    ],
    providers: AppProviders.getProviders()
})
export class AppModule {
}
