import { SHA256 } from 'crypto-js';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { ProfileService } from '@services/profile/profile.service';


@IonicPage()
@Component({
  selector: 'page-password-prompt',
  templateUrl: 'password-prompt.html',
})
export class PasswordPromptPage {
password: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private profileService: ProfileService,
    public menu: MenuController,
    public alertCtrl: AlertController) {
      this.menu.swipeEnable(false, 'left');
  }
  async checkPwd() {
    await this.profileService.getFirstProfile().then(profile => {
      if (profile.password === SHA256(profile.salt+this.password).toString()) {
        this.menu.swipeEnable(true, 'left');
        this.navCtrl.setRoot(ProfileInfoPage);
      }
      else
      {
        const alert = this.alertCtrl.create({
          title: 'Incorrect password',
          subTitle: 'Please re-enter your password',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
  }

}
