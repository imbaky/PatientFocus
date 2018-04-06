import { ProfilePage } from '@pages/profile/profile';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ProfileService, UserProfile } from '@services/profile/profile.service';
import { TabsPage } from '@pages/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-profile-selection',
  templateUrl: 'profile-selection.html',
})
export class ProfileSelectionPage implements OnInit {
  public profiles: Promise<UserProfile[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private profileService: ProfileService,
              private app: App) {
  }

  ngOnInit() {
    this.profiles = this.profileService.getAllProfiles();
  }

  async switchProfile(profileId: number) {
    await this.profileService.setCurrentProfile(profileId);
    this.navCtrl.setRoot(ProfileInfoPage);
    this.app.getRootNav().setRoot(TabsPage)
  }

  createProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }

}
