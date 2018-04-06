import { Component, ViewChild } from '@angular/core';
import { ProfileSelectionPage } from "@pages/profile-selection/profile-selection";
import { App } from "ionic-angular";


@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class OptionsPage {

  isSurvey = true;

  constructor(private app: App) {
  }

  switchProfile() {
    // Navigate to switch profile page
    this.app.getRootNav().setRoot(ProfileSelectionPage);
  }

}
