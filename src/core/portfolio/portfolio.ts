import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';

import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';
import { Item } from '../../core/data/services/item/item.service';

import { AddDocumentModal } from './modals/add-document/add-document';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  directory$: Promise<Directory>;
  currentItem: Item;
  ItemType = ItemType;
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private directoryService: DirectoryService,
  ) {
    this.currentItem = this.navParams.get('item');
    // TODO: get current profile directory id, currently set to 1.
    const id = (!this.currentItem) ? 1 : this.currentItem.type_id;
    this.directory$ = this.directoryService.getDirectoryById(id);

  }

  handleDir(event, item) {
    this.navCtrl.push(PortfolioPage, { item: item });
  }

  importNewDocument(directory: Directory) {
    const importNewDocumentModal = this.modalCtrl.create(AddDocumentModal, { directory: directory });
    importNewDocumentModal.present();
  }
}

