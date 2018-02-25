import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfileService } from '@services/profile/profile.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  name: string;

  constructor(public navCtrl: NavController, private profileService: ProfileService) {
      this.profileService.getCurrentProfile().then(profile => {
          this.name = profile.name;
      });
    }
}
