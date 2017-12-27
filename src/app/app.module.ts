import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Intro } from '../pages/intro/intro';
import { Page2 } from '../pages/page2/page2';
import { Documents } from '../pages/documents/documents';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// modules
import { DataModule } from '../core/data/data.module';
import { Profile } from '../pages/profile/profile.component';
import { Welcome } from '../pages/welcome/welcome';

@NgModule({
    declarations: [
        MyApp,
        Intro,
        Page2,
        Documents,
        Profile,
        Welcome
    ],
    imports: [
        BrowserModule,
        DataModule.forRoot(),
        IonicModule.forRoot(MyApp, {}, {links: []})
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Intro,
        Page2,
        Documents,
        Profile,
        Welcome
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
