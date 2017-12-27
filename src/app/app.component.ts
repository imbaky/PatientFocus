import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Intro } from '../pages/intro/intro';
import { Page2 } from '../pages/page2/page2';
import { Welcome } from '../pages/welcome/welcome';
import { Profile } from '../pages/profile/profile.component';
import { ProfileService } from '../core/data/services/profile/profile.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Intro;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private profileService: ProfileService) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Intro', component: Intro },
      { title: 'Page Two', component: Page2 },
      { title: 'Profile', component: Profile},
      { title: 'Welcome', component: Welcome}
    ];

    this.isProfileCreated();
  }

  isProfileCreated() {
    this.profileService.getFirstProfile().then(profile => {
      if (profile) {
        console.log('a profile is loaded');
        this.rootPage = Welcome;
      } else {
        this.rootPage = Profile;
      }
    });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
