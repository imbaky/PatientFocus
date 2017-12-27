import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

class FileChooserMock extends FileChooser {
  open(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }
}

class StatusBarMock extends StatusBar {
  isVisible: boolean;
  overlaysWebView(doesOverlay: boolean): void {}
  styleDefault(): void {}
  styleLightContent(): void {}
  styleBlackTranslucent(): void {}
  styleBlackOpaque(): void {}
  backgroundColorByName(colorName: string): void {}
  backgroundColorByHexString(hexString: string): void {}
  hide(): void {}
  show(): void {}
}

class SplashScreenMock extends SplashScreen {
  show(): void {}
  hide(): void {}
}

export class AppProviders {
  public static getProviders() {
    let providers;

    if (document.URL.includes('https://') || document.URL.includes('http://')) {
      // Use browser providers
      providers = [
        { provide: FileChooser, useClass: FileChooserMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: ErrorHandler, useClass: IonicErrorHandler }
      ];
    } else {
      // Use device providers
      providers = [
        FileChooser,
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
      ];
    }

    return providers;
  }
}
