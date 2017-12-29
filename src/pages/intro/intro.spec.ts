import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IntroPage } from './intro';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../../test-config/mocks-ionic';

describe('IntroPage', () => {
  let comp: IntroPage;
  let fixture: ComponentFixture<IntroPage>;

  beforeEach(async(() => {
    let bed = TestBed.configureTestingModule({
      declarations: [IntroPage],
      imports: [
        IonicModule.forRoot(IntroPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
      ]
    });

    fixture = TestBed.createComponent(IntroPage);
    comp = fixture.componentInstance;
  }));


  it('should create component', () => expect(comp).toBeDefined());

});
