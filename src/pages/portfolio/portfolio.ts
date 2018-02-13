import { Component, ChangeDetectorRef } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { EmailComposer } from '@ionic-native/email-composer';
import {
  ActionSheetController,
  ModalController,
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import * as moment from 'moment';
import * as _ from 'lodash';

import { DirectoryService } from '@services/directory/directory.service';
import { ItemType } from '@enum/item-type.enum';
import { ImportDocumentPage } from './import-document/import-document';
import { PortfolioType, FileFormatType } from '@enum/file-type.enum';
import { UploadType } from '@enum/upload-type.enum';
import { ProfileService } from '@services/profile/profile.service';
import { FileSystemService } from '@services/file-system/file-system.service';
import { PageType } from '@enum/page-type.enum';
import {Directory} from '@interfaces/directory/directory';
import {Item} from '@interfaces/item/item';
import {File} from '@interfaces/file/file';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  directory$: Promise<Directory>;
  currentItem: Item;

  PortfolioType = PortfolioType;
  FileFormatType = FileFormatType;
  PageType = PageType;

  searchTerm = '';
  fileTerm: FileFormatType;
  docTerm: PortfolioType;
  dateFromTerm: string;
  dateToTerm: string;
  dateMaxDate: string;
  checkedItems: boolean[];
  allItems: Item[];

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    private directoryService: DirectoryService,
    private photoViewer: PhotoViewer,
    private fileOpener: FileOpener,
    private profileService: ProfileService,
    private emailComposer: EmailComposer,
    private changeDetector: ChangeDetectorRef,
    public alertCtrl: AlertController,
    public fileSystemService: FileSystemService,
    private toastCtrl: ToastController,
  ) {
    // set date to today by default
    // otherwise format is {year: 2017, month: 0, day: 1}
    // the webpage for moment.js has more information
    this.dateFromTerm = this.getDate({ year: 2005, month: 0, day: 1 }); // set start date to be long ago to include all files by default
    this.dateToTerm = this.getDate({});
    this.dateMaxDate = this.getDate({});
    this.currentItem = this.navParams.get('item');
    // TODO: get current profile directory id, currently set to 1.
    const id = !this.currentItem ? 1 : this.currentItem.file_id;
    this.directory$ = this.directoryService.getDirectoryById(id);
    (async () => {
      const documents = await this.directory$;
      this.allItems = documents.items;
      this.checkedItems = new Array(this.allItems.length);
    })();
  }

  getDate(chosen_date) {
    const d = moment(chosen_date);
    // keeping with ISO 8601 format as far as year month day is concerned
    return d.format('YYYY-MM-DD');
  }

  handleDir(event, item) {
    this.navCtrl.push(PortfolioPage, { item: item });
  }

  handleFileImport(directory: Directory, method: string) {
    const importNewDocumentModal = this.modalCtrl.create(ImportDocumentPage, {
      directory,
      method
    });
    importNewDocumentModal.onDidDismiss(async () => {
      this.allItems = (await this.directory$).items;
    });
    importNewDocumentModal.present();
  }

  importNewDocument(directory: Directory) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Document Source',
      buttons: [
        {
          text: 'Take Picture',
          icon: 'md-camera',
          handler: this.handleFileImport.bind(
            this,
            directory,
            UploadType.TAKE_PICTURE
          )
        },
        {
          text: 'Import File',
          icon: 'md-document',
          handler: this.handleFileImport.bind(
            this,
            directory,
            UploadType.IMPORT_FILE
          )
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

  hasSelected() {
    return !_.some(this.checkedItems, value => value);
  }

  filterToggle() {
    // we want to hide the add document button
    const addButton = document.getElementById('addButton');
    if (addButton.style.visibility === 'hidden') {
      addButton.style.visibility = '';
      return;
    }
    addButton.style.visibility = 'hidden';
  }

  async viewDoc(event: any, item: Item) {
    if (this.hasSelected()) {
      const file = <File>item.file;
      if (file.format === FileFormatType.PDF) {
        try {
          // TODO investigate why some applications can read paths with %20 while others cannot
          const path = file.path.replace('%20', ' ');
          const document = await this.fileOpener.open(path, 'application/pdf');
        } catch (error) {
          console.log('Error openening file', error);
        }
      } else if (
        file.format === FileFormatType.PNG ||
        file.format === FileFormatType.JPG
      ) {
        this.photoViewer.show(file.path);
      }
    }
  }

  emailDocuments() {
    const attachments = [];
    this.checkedItems.forEach((item, i) => {
      if (this.checkedItems[i]) {
        attachments.push((this.allItems[i].file as File).path);
      }
    });
    const email = {
      to: '',
      cc: '',
      bcc: '',
      attachments: attachments,
      subject: '',
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  updateSelected(event, index) {
    this.checkedItems[index] = event.selected;
    this.changeDetector.detectChanges();
  }

  async editDocument(event: any, item: Item) {
    if (event) {
      event.preventDefault();
    }
    const directory = await this.directory$;
    const documentFormModal = this.modalCtrl.create(ImportDocumentPage, {
      directory: directory,
      method: UploadType.EDIT_DOCUMENT,
      item: item
    });
    documentFormModal.onDidDismiss(async () => {
      this.allItems = (await this.directory$).items;
    });
    documentFormModal.present();
  }

  confirmDelete(event: any, item: Item) {
    if (event) {
      event.preventDefault();
    }
    const confirmDeleteAlrt = this.alertCtrl.create({
      title: `Confirm Delete`,
      message: `Are you sure you want to delete ${item.title}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: this.handleFileDeletion.bind(this, item)
        }
      ]
    });
    confirmDeleteAlrt.present();
  }

  async handleFileDeletion(item: Item) {
    const directory = await this.directory$;
    await this.fileSystemService.deleteFileFromDirectory(item, directory);
    const importToast = this.toastCtrl.create({
      message: `${
        item.title
      } was successfully deleted`,
      duration: 3000,
      position: 'bottom'
    });
    await importToast.present();
  }
}
