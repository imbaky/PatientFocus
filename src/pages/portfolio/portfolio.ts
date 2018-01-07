import { Component } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { ActionSheetController, ModalController, NavController, NavParams} from 'ionic-angular';
import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';
import { Item } from '../../core/data/services/item/item.service';
import { ImportDocumentPage } from './import-document/import-document';
import { File } from '../../core/data/services/file/file.service';
import { DocumentType, FileFormatType } from '../../core/data/enum/file-type.enum';
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

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    private directoryService: DirectoryService,
    private photoViewer: PhotoViewer,
    private fileOpener: FileOpener
  ) {
    this.currentItem = this.navParams.get('item');
    // TODO: get current profile directory id, currently set to 1.
    const id = !this.currentItem ? 1 : this.currentItem.type_id;
    this.directory$ = this.directoryService.getDirectoryById(id);
  }

  handleDir(event, item) {
    this.navCtrl.push(PortfolioPage, { item: item });
  }
  handleFileImport(directory: Directory, method: string) {
    const importNewDocumentModal = this.modalCtrl.create(ImportDocumentPage, {directory, method});
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
        },
        {
          text: 'Import File',
          icon: 'md-document',
          handler: this.handleFileImport.bind(this, directory, UploadType.ImportFile)
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'md-close'
        }
      ]
    });
    actionSheet.present();
  }

  // filter menu event
  filterToggle() {
    // we want to hide the add document button
    const addButton = document.getElementById('addButton');
    if (addButton.style.visibility === 'hidden') {
      addButton.style.visibility = '';
      return;
    }
    addButton.style.visibility = 'hidden';
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

  async viewDoc(event: any, item: Item) {
    const file = <File>item.value;
    if (file.format === FileFormatType.PDF) {
      try {
        // TODO investigate why some applications can read paths with %20 while others cannot
        const path = file.path.replace('%20', ' ');
        const document = await this.fileOpener.open(path, 'application/pdf');
      } catch (error) {
        console.log('Error openening file', error);
      }
    } else if (file.format === FileFormatType.PNG || file.format === FileFormatType.JPG) {
      this.photoViewer.show(file.path);
    }
  }
}
