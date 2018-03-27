import { SHA256 } from 'crypto-js';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, App } from 'ionic-angular';
import { ProfileService } from '@services/profile/profile.service';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { TabsPage } from '@pages/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-password-prompt',
  templateUrl: 'password-prompt.html'
})
export class PasswordPromptPage implements OnInit {
  password: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileService: ProfileService,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public app: App,
    private androidFingerprintAuth: AndroidFingerprintAuth
  ) {
    this.menu.swipeEnable(false, 'left');
  }
  async checkPwd() {
    await this.profileService.getCurrentProfile().then(profile => {
      if (
        profile.password === SHA256(profile.salt + this.password).toString()
      ) {
        this.menu.swipeEnable(true, 'left');
        this.navCtrl.setRoot(ProfileInfoPage);
        this.app.getRootNav().setRoot(TabsPage);
      } else {
        const alert = this.alertCtrl.create({
          title: 'Incorrect password',
          subTitle: 'Please re-enter your password',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
  }
  async ngOnInit() {
    this.androidFingerprintAuth
      .isAvailable()
      .then(result => {
        if (result.isAvailable) {
          this.androidFingerprintAuth.encrypt({ clientId: 'PatientFocus', username: 'myUsername', password: 'myPassword' })
            .then(result => {
              if (result.withFingerprint || result.withBackup) {
                  this.menu.swipeEnable(true, 'left');
                  this.navCtrl.setRoot(ProfileInfoPage);
                  this.app.getRootNav().setRoot(TabsPage);
              } else { console.log('Didn\'t authenticate!'); }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          console.log('Fingerprint authentication not available');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
