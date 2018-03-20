import { PasswordPromptPageModule } from './../pages/password-prompt/password-prompt.module';
import { PasswordPromptPage } from './../pages/password-prompt/password-prompt';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AppProviders } from './app.providers';

import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// modules
import { DataModule } from '../core/data/data.module';
import { ProfilePage } from '@pages/profile/profile';
import { DashboardPage } from '@pages/dashboard/dashboard';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { PersonalInfoModal } from '@pages/../pages/profile-info/personal-information/personal-information';
import { PortfolioModule } from '@pages/portfolio/portfolio.module';
import { DiaryModule } from '@pages/diary/diary.module';
import { RemindersModule } from '@pages/reminders/reminders.module';
import { SurveyButtonComponent } from '@components/survey-button/survey-button.component';
import { TourPage } from '@pages/tour/tour';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        DashboardPage,
        ProfileInfoPage,
        TourPage,
        PersonalInfoModal,
        SurveyButtonComponent
    ],
    imports: [
        BrowserModule,
        PortfolioModule,
        RemindersModule,
        DiaryModule,
        PasswordPromptPageModule,
        DataModule.forRoot(),
        IonicModule.forRoot(MyApp, {}, {links: []}),
        BrowserAnimationsModule,
        BrMaskerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ProfilePage,
        DashboardPage,
        ProfileInfoPage,
        TourPage,
        PersonalInfoModal,
        PasswordPromptPage
    ],
    providers: AppProviders.getProviders()
})
export class AppModule {
}
