import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { EmailComposer } from '@ionic-native/email-composer';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

class FileChooserMock extends FileChooser {
  open(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }
}

interface EmailComposerOptions {
    app?: string;
    to?: string | Array<string>;
    cc?: string | Array<string>;
    bcc?: string | Array<string>;
    attachments?: Array<any>;
    subject?: string;
    body?: string;
    isHtml?: boolean;
}

class EmailComposerMock extends EmailComposer {
    /**
     * Verifies if sending emails is supported on the device.
     *
     * @param [app] {string} App id or uri scheme.
     * @returns {Promise<any>} Resolves if available, rejects if not available
     */
    isAvailable(app?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    /**
     * Adds a new mail app alias.
     *
     * @param alias {string} The alias name
     * @param packageName {string} The package name
     */
    addAlias(alias: string, packageName: string): void {}
    /**
     * Displays the email composer pre-filled with data.
     *
     * @param options {EmailComposerOptions} Email
     * @param [scope] {any} Scope for the promise
     * @returns {Promise<any>} Resolves promise when the EmailComposer has been opened
     */
    open(options: EmailComposerOptions, scope?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
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
        { provide: EmailComposer, useClass: EmailComposerMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: ErrorHandler, useClass: IonicErrorHandler }
      ];
    } else {
      // Use device providers
      providers = [
        FileChooser,
        EmailComposer,
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
      ];
    }

    return providers;
  }
}
