import { Component, ViewChild, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { NavController, Slides, App } from 'ionic-angular';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { TabsPage } from '@pages/tabs/tabs';

@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
  animations: [
    trigger('bounce', [
      state(
        '*',
        style({
          transform: 'translateX(0)'
        })
      ),
      transition(
        '* => rightSwipe',
        animate(
          '750ms ease-out',
          keyframes([
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(-75px)', offset: 0.2 }),
            style({ transform: 'translateX(0)', offset: 1 })
          ])
        )
      ),
      transition(
        '* => leftSwipe',
        animate(
          '750ms ease-out',
          keyframes([
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(75px)', offset: 0.2 }),
            style({ transform: 'translateX(0)', offset: 1 })
          ])
        )
      )
    ])
  ]
})
export class TourPage {
  @ViewChild(Slides) slides: Slides;
  skipMsg = 'Skip';
  state = 'x';

  constructor(public navCtrl: NavController, public app: App) {}

  skipTour() {
    this.navCtrl.setRoot(ProfileInfoPage);
    this.app.getRootNav().setRoot(TabsPage);
  }

  onSlideChanged() {
    if (this.slides.isEnd()) { this.skipMsg = 'Begin!'; }
  }

  onSlideDragged() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()) {
      this.state = 'rightSwipe';
    } else {
      this.state = 'leftSwipe';
    }
  }

  onSlideDone() {
    this.state = 'x';
  }
}
