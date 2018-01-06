import { Component } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams } from 'ionic-angular';

import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';
import { Item } from '../../core/data/services/item/item.service';

import { ImportDocumentPage } from './import-document/import-document';
import { File } from '../../core/data/services/file/file.service';
import { DocumentType, FileFormatType } from '../../core/data/enum/file-type.enum';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { UploadType } from '../../core/data/enum/upload-type.enum';

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

  searchTerm = '';
  fileTerm: FileFormatType;
  docTerm: DocumentType;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    private directoryService: DirectoryService,
    private photoViewer: PhotoViewer
  ) {
    this.currentItem = this.navParams.get('item');
    // TODO: get current profile directory id, currently set to 1.
    const id = (!this.currentItem) ? 1 : this.currentItem.type_id;
    this.directory$ = this.directoryService.getDirectoryById(id);

  }

  handleDir(event, item) {
    this.navCtrl.push(PortfolioPage, { item: item });
  }
  handleFileImport(directory: Directory, method: string) {
    const importNewDocumentModal = this.modalCtrl.create(ImportDocumentPage, { directory, method});
    importNewDocumentModal.present();
  }
  importNewDocument(directory: Directory) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Document Source',
      buttons: [
        {
          text: 'Take Picture',
          icon: 'md-camera',
          handler: this.handleFileImport.bind(this, directory, UploadType.TakePicture)
        }, {
          text: 'Import File',
          icon: 'md-document',
          handler: this.handleFileImport.bind(this, directory, UploadType.ImportFile)
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

  viewDoc(event: any, item: Item) {
    this.photoViewer.show((<File>item.value).path);
  }
}

