import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'detailed-view',
  templateUrl: 'detailed-view.html'
})

export class DetailedView {
  title = 'Title';
  description = 'Description';
  date = 'Date';
  imgSrc;

  constructor(private navParams: NavParams) {
    this.title = navParams.get('title');
    this.description = navParams.get('description');
    this.date = navParams.get('date');
    this.imgSrc = navParams.get('imgSrc');
  }
}
