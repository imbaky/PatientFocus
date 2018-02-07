import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProfilePage } from '@pages/profile/profile';
import { DashboardPage } from '@pages/dashboard/dashboard';
import { RemindersPage } from '@pages/reminders/reminders';
import { DiaryPage } from '@pages/diary/diary';
import { ProfileService } from '@services/profile/profile.service';
import { PortfolioPage } from '@pages/portfolio/portfolio';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProfilePage;
  name: string;
  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private profileService: ProfileService,
    private events: Events
  ) {
    this.pages = [
      { title: 'Profile info', component: ProfileInfoPage },
      // { title: 'Dashboard', component: DashboardPage },
      { title: 'Medical Portfolio', component: PortfolioPage },
      { title: 'Personal Diary', component: DiaryPage },
      { title: 'Reminders', component: RemindersPage },
    ];
    this.events.subscribe('profile:update', profile => {this.name = profile.name; });

  }

  ngOnInit() {
    this.profileService.getFirstProfile().then(profile => {
      if (profile) {
        this.rootPage = ProfileInfoPage;
      } else {
        this.rootPage = ProfilePage;
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
