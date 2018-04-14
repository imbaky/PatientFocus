import { ProfileSelectionPage } from '@pages/profile-selection/profile-selection';
import { PasswordPromptPage } from '@pages/password-prompt/password-prompt';
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Nav, Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProfilePage } from '@pages/profile/profile';
import { RemindersPage } from '@pages/reminders/reminders';
import { DiaryPage } from '@pages/diary/diary';
import { ProfileService } from '@services/profile/profile.service';
import { PortfolioPage } from '@pages/portfolio/portfolio';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { ItemService } from '@services/item/item.service';
import { HelpPage } from '@pages/help/help';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProfilePage;
  name: string;
  profileImg: string;
  pages: Array<{ title: string; component: any }>;
  isSurvey = true;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private profileService: ProfileService,
    private itemService: ItemService,
    private ref: ChangeDetectorRef,
    private events: Events,
    private app: App

  ) {
    this.pages = [
      { title: 'Profile info', component: ProfileInfoPage },
      { title: 'Medical Portfolio', component: PortfolioPage },
      { title: 'Personal Diary', component: DiaryPage },
      { title: 'Reminders', component: RemindersPage },
      { title: 'Help', component: HelpPage}
    ];
    this.events.subscribe('profile:update', profile => {this.name = profile.name; });

    this.profileService.profile.subscribe(name => this.name = name);
    this.profileService.profileImg.subscribe(img => {
      this.profileImg = img;
      this.ref.detectChanges();
    });
  }

  async ngOnInit() {
    const profile = await this.profileService.getCurrentProfile();
    if (profile) {
      this.app.getRootNav().setRoot(PasswordPromptPage);
    } else {
      this.app.getRootNav().setRoot(ProfilePage);
    }
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
