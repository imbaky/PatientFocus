import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// modules
import { DataModule } from '../core/data/data.module';
import { ProfilePage } from '@pages/profile/profile';
import { DashboardPage } from '@pages/dashboard/dashboard';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { EditInfoModal } from '@pages/profile-info/edit-info/edit-info';
import { PortfolioModule } from '@pages/portfolio/portfolio.module';
import { DiaryModule } from '@pages/diary/diary.module';
import { RemindersModule } from '@pages/reminders/reminders.module';
import { TourPage } from '@pages/tour//tour';

@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        DashboardPage,
        ProfileInfoPage,
        TourPage,
        EditInfoModal
    ],
    imports: [
        BrowserModule,
        PortfolioModule,
        RemindersModule,
        DiaryModule,
        DataModule.forRoot(),
        IonicModule.forRoot(MyApp, {}, {links: []}),
        BrowserAnimationsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ProfilePage,
        DashboardPage,
        ProfileInfoPage,
        TourPage,
        EditInfoModal,
    ],
    providers: AppProviders.getProviders()
})
export class AppModule {
}
