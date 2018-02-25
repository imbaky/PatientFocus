import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController
} from 'ionic-angular';
import * as moment from 'moment';
import { ProfileService, UserProfile } from '@services/profile/profile.service';
import { ItemService, Item } from '@services/item/item.service';
import { AddEntryPage } from './add-entry/add-entry';
import { DetailedView } from '@components/detailed-view/detailed-view.component';
import {
  Directory,
  DirectoryService
} from '@services/directory/directory.service';
import { FileSystemService } from '@services/file-system/file-system.service';
import { EditEntryPage } from './edit-entry/edit-entry';
import { PageType } from '@enum/page-type.enum';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})
export class DiaryPage {
  items$: Promise<Item[]>;
  directory: Directory;
  PageType = PageType;
  profileId: number;

  searchTerm = '';
  dateFromTerm: string;
  dateToTerm: string;
  dateMaxDate: string;

  constructor(
    public modalCtrl: ModalController,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private directoryService: DirectoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fileSystemService: FileSystemService
  ) {
    // set date to today by default
    // otherwise format is {year: 2017, month: 0, day: 1}
    // the webpage for moment.js has more information
    this.dateFromTerm = this.getDate({ year: 2005, month: 0, day: 1 }); // set start date to be long ago to include all files by default
    this.dateToTerm = this.getDate({});
    this.dateMaxDate = this.getDate({});

    this.getDiaryEntries();

  }

  getDate(chosen_date) {
    const d = moment(chosen_date);
    // keeping with ISO 8601 format as far as year month day is concerned
    return d.format('YYYY-MM-DD');
  }

  filterToggle() {
    // we want to hide the add entry button
    const addButton = document.getElementById('addButton');
    if (addButton.style.visibility === 'hidden') {
      addButton.style.visibility = '';
      return;
    }
    addButton.style.visibility = 'hidden';
  }

  getDiaryEntries() {
    this.profileService.getFirstProfileId().then(async (profileId) => { // TODO need to get actual profile id
      this.profileId = profileId;
      this.items$ = this.profileService.getProfileDiaryItems(profileId);
      this.directory = await this.directoryService.getDirectoryById(profileId);
    });
  }

  /**
   * Add diary entry
   * @param itemsToSend Item
   */
  async addEntry(itemsToSend: Item[]) {
    const items = await itemsToSend;
    const addEntry = this.modalCtrl.create(AddEntryPage, { directory: this.directory, items});
    addEntry.onDidDismiss(async () => {
      this.getDiaryEntries();
    });
    addEntry.present();
  }

  /**
   * Show details of a diary entry
   * @param event View details of an entry
   * @param entry Selected entry
   */
  viewDetails(event: any, entry: Item) {
    if (entry.file) {
      this.navCtrl.push(DetailedView, {
        title: entry.title,
        description: entry.description,
        date: entry.chosen_date,
        imgSrc: entry.file.path
      });
    } else {
      this.navCtrl.push(DetailedView, {
        title: entry.title,
        description: entry.description,
        date: entry.chosen_date
      });
    }
  }

  /**
   * Prompt user for a deletion of a diary entry
   * @param event Event
   * @param item Diary item to delete
   */
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

  /**
   * Diary item deletion handler
   * @param item Diary item to delete
   */
  async handleFileDeletion(item: Item) {
    const result = await this.fileSystemService.deleteFileFromDirectory(
      item,
      this.directory
    );
    const importToast = this.toastCtrl.create({
      message: `${item.title} was successfully deleted`,
      duration: 3000,
      position: 'bottom'
    });
    await importToast.present();
    // TODO - Needs to change asap...
    this.profileService.getFirstProfileId().then(async profileId => {
      this.items$ = this.profileService.getProfileDiaryItems(profileId);
      this.directory = await this.directoryService.getDirectoryById(profileId);
    });
  }

  async editEntry(event: any, item: Item) {
    if (event) {
      event.preventDefault();
    }
    const documentFormModal = this.modalCtrl.create(EditEntryPage, {
      directory: this.directory,
      item: item
    });
    documentFormModal.onDidDismiss(async () => {
      this.items$ = this.profileService.getProfileDiaryItems(this.profileId);
    });
    documentFormModal.present();
  }
}
