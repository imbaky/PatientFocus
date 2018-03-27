import { Component } from '@angular/core';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { PortfolioPage } from '@pages/portfolio/portfolio';
import { DiaryPage } from '@pages/diary/diary';
import { RemindersPage } from '@pages/reminders/reminders';
import { MorePage } from "@pages/more/more";


@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;
  public tab4Root: any;
  public tab5Root: any;

  constructor() {
    this.tab1Root = ProfileInfoPage;
    this.tab2Root = PortfolioPage;
    this.tab3Root = DiaryPage;
    this.tab4Root = RemindersPage;
    this.tab5Root = MorePage;
  }
}
