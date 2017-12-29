import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Intro } from './intro';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../../test-config/mocks-ionic';

describe('Intro', () => {
  let comp: Intro;
  let fixture: ComponentFixture<Intro>;

  beforeEach(async(() => {
    let bed = TestBed.configureTestingModule({
      declarations: [Intro],
      imports: [
        IonicModule.forRoot(Intro)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
      ]
    });

    fixture = TestBed.createComponent(Intro);
    comp = fixture.componentInstance;
  }));


  it('should create component', () => expect(comp).toBeDefined());

});
