import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Documents } from './documents';
import { FilterItemPipe } from '../../pipes/filteritem.pipe';
import { IonicModule, Platform, NavController, NavParams } from 'ionic-angular/index';
import { DataModule } from '../../core/data/data.module';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock, NavMock } from '../../../test-config/mocks-ionic';

describe('Component: Documents', () => {

    let component: Documents;
    let fixture: ComponentFixture<Documents>;

    beforeEach(() => {
        let NavParamMock = {
            get: jasmine.createSpy('get')
        };

        TestBed.configureTestingModule({
            declarations: [Documents, FilterItemPipe],
            imports: [
                IonicModule.forRoot(Documents),
                DataModule.forRoot()
            ],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useValue: NavParamMock }
            ]
        });

        fixture = TestBed.createComponent(Documents);

        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component instanceof Documents).toBe(true);
    });
});
