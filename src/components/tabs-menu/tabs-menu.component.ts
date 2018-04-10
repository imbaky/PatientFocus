import { Component } from '@angular/core';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { PortfolioPage } from '@pages/portfolio/portfolio';
import { DiaryPage } from '@pages/diary/diary';
import { RemindersPage } from '@pages/reminders/reminders';
import { OptionsPage } from '@pages/options/options';


@Component({
  selector: 'tabs-menu',
  templateUrl: 'tabs-menu.component.html',
})
export class TabsMenuComponent {
  public PortfolioInfoTab: any;
  public PortfolioTab: any;
  public DiaryTab: any;
  public RemindersTab: any;
  public OptionsTab: any;

  constructor() {
    this.PortfolioInfoTab = ProfileInfoPage;
    this.PortfolioTab = PortfolioPage;
    this.DiaryTab = DiaryPage;
    this.RemindersTab = RemindersPage;
    this.OptionsTab = OptionsPage;
  }
}
