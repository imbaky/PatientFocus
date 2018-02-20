import { Component, ViewChild, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';

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

  constructor(public navCtrl: NavController) {}

  skipTour() {
    this.navCtrl.setRoot(ProfileInfoPage);
    this.navCtrl.push(ProfileInfoPage);
  }

  onSlideChanged() {
    if (this.slides.isEnd()) { this.skipMsg = 'Begin!'; }
  }

  onSlideDragged() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()) {
      this.state = 'rightSwipe';
    }
    else { this.state = 'leftSwipe'; }
  }

  onSlideDone() {
    this.state = 'x';
  }
}
