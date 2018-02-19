import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileService } from '@services/profile/profile.service';


@IonicPage()
@Component({
  selector: 'page-password-prompt',
  templateUrl: 'password-prompt.html',
})
export class PasswordPromptPage {
pwd: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private profileService: ProfileService) {
  }
  async checkPwd() {
    this.profileService.getFirstProfile().then(profile => {
      if (profile.password === this.pwd) {
        this.navCtrl.setRoot(ProfileInfoPage);
      }
    });
  }

}
