import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'detailed-view',
  templateUrl: 'detailed-view.html'
})

export class DetailedView {
  title: string = 'Title';
  description: string = 'Description';
  date: string = 'Date';
  
  constructor(private navParams: NavParams) {
    this.title = navParams.get('title');
    this.description = navParams.get('description');
    this.date = navParams.get('date');
  }
}