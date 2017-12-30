import { Component } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams } from 'ionic-angular';

import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';
import { Item } from '../../core/data/services/item/item.service';

import { ImportDocumentPage } from './import-document/import-document';
import { File } from '../../core/data/services/file/file.service';
import { DocumentType, FileFormatType } from '../../core/data/enum/file-type.enum';


@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {

  directory$: Promise<Directory>;
  currentItem: Item;

  ItemType = ItemType;
  DocumentType = DocumentType;
  FileFormatType = FileFormatType;

  searchTerm = "";
  fileTerm: FileFormatType;
  docTerm: DocumentType;

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
  handleFileImport(directory: Directory) {
    const importNewDocumentModal = this.modalCtrl.create(ImportDocumentPage, { directory });
    importNewDocumentModal.present();
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
          handler: this.handleFileImport.bind(this, directory)
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: 'md-close'
        }
      ]
    });
    actionSheet.present();
  }

  filterName(item: Item, compare: string) {
    return item.name.toLowerCase().includes(compare.toLowerCase());
  }

  filterDocumentType(item: Item, type: DocumentType) {
    return (item.value as File).document_type === type;
  }

  filterFormatType(item: Item, type: FileFormatType) {
    return (item.value as File).format === type;
  }

}

