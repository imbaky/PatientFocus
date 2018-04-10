import { Component, ViewChild } from '@angular/core';
import { ProfileSelectionPage } from '@pages/profile-selection/profile-selection';
import { HelpPage } from '@pages/help/help';
import { App, NavController } from 'ionic-angular';


@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {

  isSurvey = true;

  constructor(
    public navCtrl: NavController,
    private app: App,
  ) {
  }

  switchProfile() {
    // Navigate to switch profile page
    this.app.getRootNav().setRoot(ProfileSelectionPage);
  }

  handleHelp() {
    this.navCtrl.push(HelpPage);
  }
}
