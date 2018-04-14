import { ProfileSelectionPageModule } from '@pages/profile-selection/profile-selection.module';
import { ProfileSelectionPage } from '@pages/profile-selection/profile-selection';
import { PasswordPromptPageModule } from '@pages/password-prompt/password-prompt.module';
import { PasswordPromptPage } from '@pages/password-prompt/password-prompt';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AndroidFingerprintAuthProvider, SplashScreenProvider, StatusBarProvider, EmailComposerProvider, FileChooserProvider } from './app.providers';

import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// modules
import { DataModule } from '../core/data/data.module';
import { ProfilePage } from '@pages/profile/profile';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { PersonalInfoModal } from '@pages/../pages/profile-info/personal-information/personal-information';
import { PortfolioModule } from '@pages/portfolio/portfolio.module';
import { DiaryModule } from '@pages/diary/diary.module';
import { RemindersModule } from '@pages/reminders/reminders.module';
import { SurveyButtonComponent } from '@components/survey-button/survey-button.component';
import { TourPage } from '@pages/tour/tour';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { TabsMenuComponent } from '@components/tabs-menu/tabs-menu.component';
import { OptionsPage } from '@pages/options/options';
import { HelpPage } from '@pages/help/help';

@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        ProfileInfoPage,
        TourPage,
        PersonalInfoModal,
        SurveyButtonComponent,
        TabsMenuComponent,
        OptionsPage,
        HelpPage
    ],
    imports: [
        BrowserModule,
        PortfolioModule,
        RemindersModule,
        DiaryModule,
        PasswordPromptPageModule,
        ProfileSelectionPageModule,
        DataModule.forRoot(),
        IonicModule.forRoot(MyApp, {}, {links: []}),
        BrowserAnimationsModule,
        BrMaskerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ProfilePage,
        ProfileInfoPage,
        TourPage,
        PersonalInfoModal,
        PasswordPromptPage,
        TabsMenuComponent,
        OptionsPage,
        ProfileSelectionPage,
        HelpPage
    ],
    providers: [
        FileChooserProvider,
        EmailComposerProvider,
        StatusBarProvider,
        SplashScreenProvider,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AndroidFingerprintAuthProvider
    ]
})
export class AppModule {
}
