import { ProfilePage } from '@pages/profile/profile';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileService, UserProfile } from '@services/profile/profile.service';

@IonicPage()
@Component({
  selector: 'page-profile-selection',
  templateUrl: 'profile-selection.html',
})
export class ProfileSelectionPage {
  public profiles: Promise<UserProfile[]>;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private profileService: ProfileService ) {
  }

  ngOnInit() {
    this.profiles = this.profileService.getAllProfiles();
}
  async switchProfile(profileId: number) {
    await this.profileService.setCurrentProfile(profileId);
    this.profileService.getCurrentProfile().then(profile => {console.log(profile.name); });
    this.navCtrl.setRoot(ProfileInfoPage);
  }

  createProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }

}
