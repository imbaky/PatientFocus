import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfileService } from '../../core/data/services/profile/profile.service';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  name: string;

  constructor(public navCtrl: NavController, private profileService: ProfileService) {
      this.profileService.getFirstProfile().then(profile => {
          this.name = profile.name;
      });
    }

    clear() {
      this.profileService.clearDb();
    }

    show() {
      this.profileService.getFirstProfile().then(profile => {
          console.log(profile);
      })
    }
}
