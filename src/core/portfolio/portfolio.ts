import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AddDocumentModal } from './modals/add-document/add-document';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {

  constructor(public modalCtrl: ModalController) {}

  importNewDocument() {
    const myModal = this.modalCtrl.create(AddDocumentModal);
    myModal.present();
  }
}
