import { Component } from '@angular/core';
import { Profile } from '../profile/profile'
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class Intro {

  constructor(public navCtrl: NavController) {

  }
  
  createProfileClicked(){
    this.navCtrl.setRoot(Profile);
  }

  importFileClicked(){
    console.log("There is not import file page right now");
  }
}
