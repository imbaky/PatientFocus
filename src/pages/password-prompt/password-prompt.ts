import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
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
    public menu: MenuController) {
      this.menu.swipeEnable(false, 'left');
  }
  async checkPwd() {
    this.profileService.getFirstProfile().then(profile => {
      if (profile.password === this.password) {
        this.menu.swipeEnable(true, 'left');
        this.navCtrl.setRoot(ProfileInfoPage);
      }
    });
  }

}
