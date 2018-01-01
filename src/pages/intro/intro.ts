import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {

  constructor(public navCtrl: NavController) {

  }

  createProfileClicked() {
    this.navCtrl.setRoot(ProfilePage);
  }
}
