import { Component, ViewChild } from '@angular/core';
import { ProfileSelectionPage } from '@pages/profile-selection/profile-selection';
import { HelpPage } from '@pages/help/help';
import { App, NavController, ToastController } from 'ionic-angular';
import { ProfileService } from '@services/profile/profile.service';


@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {

  isSurvey = true;

  constructor(private app: App,
              public navCtrl: NavController,
              private toastCtrl: ToastController,
              private profileService: ProfileService) {
  }

  switchProfile() {
    // Navigate to switch profile page
    this.app.getRootNav().setRoot(ProfileSelectionPage);
  }

  handleHelp() {
    this.navCtrl.push(HelpPage);
  }

  async exportProfile() {
    const importToast = this.toastCtrl.create({
      message: `Profile exported to Downloads folder as patient-focus-profile.zip`,
      duration: 6000,
      position: 'bottom'
    });
    await importToast.present();
    this.profileService.exportProfile(await this.profileService.getCurrentProfileId());
  }
}
