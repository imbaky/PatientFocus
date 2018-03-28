import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { EmailComposer } from '@ionic-native/email-composer';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { RemindersService } from '@services/reminders/reminders.service';

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
interface AFAAuthOptions {
  clientId: string;
  username?: string;
  password?: string;
  token?: string;
  disableBackup?: boolean;
  locale?: string;
  maxAttempts?: number;
  userAuthRequired?: boolean;
  dialogTitle?: string;
  dialogMessage?: string;
  dialogHint?: string;
}
interface AFADecryptOptions {
  withFingerprint: boolean;
  withBackup: boolean;
  password: string;
}
interface AFAEncryptResponse {
  withFingerprint: boolean;
  withBackup: boolean;
  token: string;
}

export class FileChooserMock extends FileChooser {
  open(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }
}

export class EmailComposerMock extends EmailComposer {
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

export class StatusBarMock extends StatusBar {
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

export class SplashScreenMock extends SplashScreen {
  show(): void {}
  hide(): void {}
}

export class AndroidFingerprintAuthMock extends AndroidFingerprintAuth {
  ERRORS: {
      BAD_PADDING_EXCEPTION: 'BAD_PADDING_EXCEPTION';
      CERTIFICATE_EXCEPTION: 'CERTIFICATE_EXCEPTION';
      FINGERPRINT_CANCELLED: 'FINGERPRINT_CANCELLED';
      FINGERPRINT_DATA_NOT_DELETED: 'FINGERPRINT_DATA_NOT_DELETED';
      FINGERPRINT_ERROR: 'FINGERPRINT_ERROR';
      FINGERPRINT_NOT_AVAILABLE: 'FINGERPRINT_NOT_AVAILABLE';
      FINGERPRINT_PERMISSION_DENIED: 'FINGERPRINT_PERMISSION_DENIED';
      FINGERPRINT_PERMISSION_DENIED_SHOW_REQUEST: 'FINGERPRINT_PERMISSION_DENIED_SHOW_REQUEST';
      ILLEGAL_BLOCK_SIZE_EXCEPTION: 'ILLEGAL_BLOCK_SIZE_EXCEPTION';
      INIT_CIPHER_FAILED: 'INIT_CIPHER_FAILED';
      INVALID_ALGORITHM_PARAMETER_EXCEPTION: 'INVALID_ALGORITHM_PARAMETER_EXCEPTION';
      IO_EXCEPTION: 'IO_EXCEPTION';
      JSON_EXCEPTION: 'JSON_EXCEPTION';
      MINIMUM_SDK: 'MINIMUM_SDK';
      MISSING_ACTION_PARAMETERS: 'MISSING_ACTION_PARAMETERS';
      MISSING_PARAMETERS: 'MISSING_PARAMETERS';
      NO_SUCH_ALGORITHM_EXCEPTION: 'NO_SUCH_ALGORITHM_EXCEPTION';
      SECURITY_EXCEPTION: 'SECURITY_EXCEPTION';
  };

  encrypt(options: AFAAuthOptions): Promise<AFAEncryptResponse> {
      let reponse: AFAEncryptResponse;
      return new Promise((resolve, reject) => {
          resolve(reponse);
      });
  }

  decrypt(options: AFAAuthOptions): Promise<AFADecryptOptions> {
      let reponse: AFADecryptOptions;
      return new Promise((resolve, reject) => {
          resolve(reponse);
      });
  }

  isAvailable(): Promise<{
      isAvailable: boolean;
      isHardwareDetected: boolean;
      hasEnrolledFingerprints: boolean;
  }> {
      const reponse: { isAvailable: boolean, isHardwareDetected: boolean, hasEnrolledFingerprints: boolean} = {isAvailable: true, isHardwareDetected: true, hasEnrolledFingerprints: true};
      return new Promise((resolve, reject) => {
          resolve(reponse);
      });
  }

  delete(options: {
      clientId: string;
      username: string;
  }): Promise<{
      deleted: boolean;
  }> {
      let reponse: { deleted: boolean};
      return new Promise((resolve, reject) => {
          resolve(reponse);
      });
  }
}


export const FileChooserProvider = [
    { provide: FileChooser, useClass: (document.URL.includes('https://') || document.URL.includes('http://')) ? FileChooserMock : FileChooser },
  ];

export const EmailComposerProvider = [
    { provide: EmailComposer, useClass: (document.URL.includes('https://') || document.URL.includes('http://')) ? EmailComposerMock : EmailComposer },
  ];

export const StatusBarProvider = [
    { provide: StatusBar, useClass: (document.URL.includes('https://') || document.URL.includes('http://')) ? StatusBarMock : StatusBar },
  ];

export const SplashScreenProvider = [
    { provide: SplashScreen, useClass: (document.URL.includes('https://') || document.URL.includes('http://')) ? SplashScreenMock : SplashScreen },
  ];

export const AndroidFingerprintAuthProvider = [
    { provide: AndroidFingerprintAuth, useClass: (document.URL.includes('https://') || document.URL.includes('http://')) ? AndroidFingerprintAuthMock : AndroidFingerprintAuth },
  ];

  