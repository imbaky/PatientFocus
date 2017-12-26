import { Component } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams } from 'ionic-angular';

import { Directory, DirectoryService } from '../../../core/data/services/directory/directory.service';
import { ItemType } from '../../../core/data/enum/item-type.enum';
import { Item } from '../../../core/data/services/item/item.service';

import { ImportDocumentPage } from '../../pages/import-document/import-document';

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
    public actionSheetCtrl: ActionSheetController,
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
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Document Source',
      buttons: [
        {
          text: 'Take Picture',
          icon: 'md-camera',
          handler: () => {
            // TODO - User Story #1
          }
        }, {
          text: 'Import File',
          icon: 'md-document',
          handler: () => {
            const importNewDocumentModal = this.modalCtrl.create(ImportDocumentPage, { directory: directory });
            importNewDocumentModal.present();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: 'md-close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}

