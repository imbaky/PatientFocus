import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import {
    PlatformMock,
    StatusBarMock,
    SplashScreenMock
} from '../../test-config/mocks-ionic';
import { ProfileService } from "../core/data/services/profile/profile.service";
import { DexieService } from "../core/data/services/dexie/dexie.service";

describe('MyApp Component', () => {
    let fixture;
    let component;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp],
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                {provide: StatusBar, useClass: StatusBarMock},
                {provide: SplashScreen, useClass: SplashScreenMock},
                {provide: Platform, useClass: PlatformMock},
                ProfileService,
                DexieService
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyApp);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component instanceof MyApp).toBe(true);
    });


    it('should have two pages', () => {
        expect(component.pages.length).toBe(2);
    });

});
