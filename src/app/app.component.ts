import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IntroPage } from '../pages/intro/intro';
import { WelcomePage } from '../pages/welcome/welcome';
import { ProfileService } from '../core/data/services/profile/profile.service';
import { PortfolioPage } from '../pages/portfolio/portfolio';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = IntroPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private profileService: ProfileService) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Welcome Page', component: WelcomePage},
      { title: 'Medical Portfolio', component: PortfolioPage }
    ];

    this.isProfileCreated();
  }

  isProfileCreated() {
    this.profileService.getFirstProfile().then(profile => {
      if (profile) {
        this.rootPage = WelcomePage;
      } else {
        this.rootPage = IntroPage;
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
